import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';

import { createDemoPack } from '../domain/demoCollection';
import { DemoCollectionProvider, useDemoCollection } from './DemoCollectionContext';

function CollectionHarness() {
  const { packs, addPack, resetCollection, hydrated } = useDemoCollection();
  return (
    <>
      <Text>{packs.length} packs</Text>
      <Text>{hydrated ? 'Loaded' : 'Loading'}</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Add pack" onPress={() => addPack('pitch-black')} />
      <Pressable accessibilityRole="button" accessibilityLabel="Reset collection" onPress={resetCollection} />
    </>
  );
}

describe('DemoCollectionProvider persistence', () => {
  it('finishes earlier saves before persisting a reset', async () => {
    const pending: (() => void)[] = [];
    let disk = '';
    const storage = {
      getItem: async () => null,
      setItem: (_key: string, value: string) => new Promise<void>((resolve) => {
        pending.push(() => { disk = value; resolve(); });
      }),
    };
    render(<DemoCollectionProvider storage={storage}><CollectionHarness /></DemoCollectionProvider>);
    await waitFor(() => expect(screen.getByText('Loaded')).toBeTruthy());
    fireEvent.press(screen.getByRole('button', { name: 'Add pack' }));
    fireEvent.press(screen.getByRole('button', { name: 'Reset collection' }));
    // Complete writes in reverse arrival order to expose overlapping saves.
    await act(async () => {
      for (let step = 0; step < 10; step += 1) {
        pending.pop()?.();
        await Promise.resolve();
      }
    });
    expect(JSON.parse(disk).packs).toEqual([]);
  });
  it('merges actions made during hydration and never saves the initial empty state', async () => {
    let resolveStored!: (value: string | null) => void;
    const stored = new Promise<string | null>((resolve) => { resolveStored = resolve; });
    const storage = {
      getItem: jest.fn(() => stored),
      setItem: jest.fn(async (_key: string, _value: string) => undefined),
    };

    render(
      <DemoCollectionProvider storage={storage}>
        <CollectionHarness />
      </DemoCollectionProvider>,
    );

    expect(screen.getByText('0 packs')).toBeTruthy();
    expect(screen.getByText('Loading')).toBeTruthy();
    expect(storage.setItem).not.toHaveBeenCalled();
    fireEvent.press(screen.getByRole('button', { name: 'Add pack' }));
    expect(screen.getByText('1 packs')).toBeTruthy();
    expect(storage.setItem).not.toHaveBeenCalled();

    await act(async () => {
      resolveStored(JSON.stringify({ version: 1, packs: [createDemoPack('ascended-heroes')] }));
      await stored;
    });

    await waitFor(() => expect(screen.getByText('2 packs')).toBeTruthy());
    expect(screen.getByText('Loaded')).toBeTruthy();
    await waitFor(() => expect(storage.setItem).toHaveBeenCalledTimes(1));
    const persisted = JSON.parse(storage.setItem.mock.calls[0][1]);
    expect(persisted.packs.map((pack: { id: string }) => pack.id)).toEqual([
      'demo-pitch-black',
      'demo-ascended-heroes',
    ]);
  });

  it('keeps a reset empty when hydration finishes with older stored packs', async () => {
    let resolveStored!: (value: string | null) => void;
    const stored = new Promise<string | null>((resolve) => { resolveStored = resolve; });
    const storage = {
      getItem: jest.fn(() => stored),
      setItem: jest.fn(async (_key: string, _value: string) => undefined),
    };

    render(
      <DemoCollectionProvider storage={storage}>
        <CollectionHarness />
      </DemoCollectionProvider>,
    );

    fireEvent.press(screen.getByRole('button', { name: 'Reset collection' }));
    await act(async () => {
      resolveStored(JSON.stringify({ version: 1, packs: [createDemoPack('ascended-heroes')] }));
      await stored;
    });

    await waitFor(() => expect(storage.setItem).toHaveBeenCalledTimes(1));
    expect(screen.getByText('0 packs')).toBeTruthy();
    expect(JSON.parse(storage.setItem.mock.calls[0][1]).packs).toEqual([]);
  });
});
