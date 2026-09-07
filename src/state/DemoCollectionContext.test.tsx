import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Pressable, Text } from 'react-native';

import { createDemoPack } from '../domain/demoCollection';
import { DemoCollectionProvider, useDemoCollection } from './DemoCollectionContext';

function CollectionHarness() {
  const { packs, addPack } = useDemoCollection();
  return (
    <>
      <Text>{packs.length} packs</Text>
      <Pressable accessibilityRole="button" accessibilityLabel="Add pack" onPress={() => addPack('pitch-black')} />
    </>
  );
}

describe('DemoCollectionProvider persistence', () => {
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
    expect(storage.setItem).not.toHaveBeenCalled();
    fireEvent.press(screen.getByRole('button', { name: 'Add pack' }));
    expect(screen.getByText('1 packs')).toBeTruthy();
    expect(storage.setItem).not.toHaveBeenCalled();

    await act(async () => {
      resolveStored(JSON.stringify({ version: 1, packs: [createDemoPack('ascended-heroes')] }));
      await stored;
    });

    await waitFor(() => expect(screen.getByText('2 packs')).toBeTruthy());
    await waitFor(() => expect(storage.setItem).toHaveBeenCalledTimes(1));
    const persisted = JSON.parse(storage.setItem.mock.calls[0][1]);
    expect(persisted.packs.map((pack: { id: string }) => pack.id)).toEqual([
      'demo-pitch-black',
      'demo-ascended-heroes',
    ]);
  });
});
