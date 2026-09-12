import { act, fireEvent, render, screen } from '@testing-library/react-native';
import { Animated } from 'react-native';

import { createDemoPack, openDemoPack } from '../../domain/demoCollection';
import { BinderScreen } from '../binder/BinderScreen';
import { MyPacksScreen } from './MyPacksScreen';
import { RevealScreen } from './RevealScreen';

describe('demo pack flow screens', () => {
  it('advances only once when next is pressed repeatedly during an animation', async () => {
    let finish: ((result: { finished: boolean }) => void) | undefined;
    const pending: ((result: { finished: boolean }) => void)[] = [];
    const timing = jest.spyOn(Animated, 'timing').mockImplementation(() => ({
      start: (callback) => { finish = callback; if (callback) pending.push(callback); }, stop: jest.fn(), reset: jest.fn(),
    }));
    try {
      render(<RevealScreen pack={createDemoPack('pitch-black')} onRip={jest.fn()} onClose={jest.fn()} />);
      await act(async () => { await Promise.resolve(); });
      fireEvent.press(screen.getByRole('button', { name: 'Rip it' }));
      act(() => pending.splice(0).forEach((callback) => callback({ finished: true })));
      expect(screen.getByText('CARD 1 OF 10')).toBeTruthy();
      expect(screen.getByText('9 cards remain in the stack')).toBeTruthy();
      expect(screen.getByText('1 of 10 new cards added to Binder')).toBeTruthy();
      expect(screen.getByLabelText('Swipe left to throw this card forward')).toBeTruthy();
      fireEvent.press(screen.getByRole('button', { name: 'Next card' }));
      fireEvent.press(screen.getByRole('button', { name: 'Next card' }));
      act(() => pending.splice(0).forEach((callback) => callback({ finished: true })));
      expect(screen.getByText('CARD 2 OF 10')).toBeTruthy();
      fireEvent.press(screen.getByRole('button', { name: 'Next card' }));
      act(() => finish?.({ finished: false }));
      expect(screen.getByText('CARD 2 OF 10')).toBeTruthy();
      fireEvent.press(screen.getByRole('button', { name: 'Next card' }));
      act(() => finish?.({ finished: true }));
      expect(screen.getByText('CARD 3 OF 10')).toBeTruthy();
    } finally { timing.mockRestore(); }
  });
  it('shows a sealed pack and opens it', () => {
    const onOpen = jest.fn();
    const pack = createDemoPack('pitch-black');
    render(<MyPacksScreen packs={[pack]} onOpen={onOpen} />);

    expect(screen.getByText('SEALED DEMO PACK')).toBeTruthy();
    expect(screen.getByLabelText('Pitch Black booster pack artwork')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Open Pitch Black demo pack' }));
    expect(onOpen).toHaveBeenCalledWith(pack.id);
  });

  it('uses a top-edge tear interaction with a compact fallback rip action', async () => {
    const onRip = jest.fn();
    const pack = createDemoPack('pitch-black');
    const reveal = render(<RevealScreen pack={pack} onRip={onRip} onClose={jest.fn()} />);
    await act(async () => { await Promise.resolve(); });

    expect(screen.getByLabelText('Pitch Black booster pack artwork')).toBeTruthy();
    expect(screen.getByText('Slide along the top edge to tear it open')).toBeTruthy();
    expect(screen.getByText('Start at the tear notch, then drag left.')).toBeTruthy();
    expect(screen.getByLabelText('Slide along the pack top edge to tear it open')).toBeTruthy();
    expect(screen.getByTestId('reveal-close-icon').props.name).toBe('close');
    fireEvent.press(screen.getByRole('button', { name: 'Rip it' }));
    expect(onRip).toHaveBeenCalledTimes(1);
    reveal.unmount();
  });

  it('puts a newly prepared sealed pack ahead of an older opened pack', () => {
    const opened = openDemoPack(createDemoPack('pitch-black'));
    const sealed = createDemoPack('time-of-battle', 'demo-time-of-battle-fresh');
    render(<MyPacksScreen packs={[opened, sealed]} onOpen={jest.fn()} />);

    expect(screen.getAllByText(/SEALED DEMO PACK|OPENED · 10 CARDS/)[0].props.children).toBe('SEALED DEMO PACK');
  });
  it('separates opened packs into a history with their best pull', () => {
    const opened = openDemoPack(createDemoPack('pitch-black'));
    render(<MyPacksScreen packs={[opened]} onOpen={jest.fn()} />);

    expect(screen.getByText('PACK HISTORY')).toBeTruthy();
    expect(screen.getByText('Best pull · Mega Darkrai ex')).toBeTruthy();
    expect(screen.getByText('10 cards collected')).toBeTruthy();
  });
  it('offers Binder and shop destinations after a reveal', () => {
    const onViewBinder = jest.fn();
    const onBrowsePacks = jest.fn();
    render(<RevealScreen pack={openDemoPack(createDemoPack('pitch-black'))} onRip={jest.fn()} onClose={jest.fn()} onViewBinder={onViewBinder} onBrowsePacks={onBrowsePacks} />);
    fireEvent.press(screen.getByRole('button', { name: 'View Binder' }));
    expect(onViewBinder).toHaveBeenCalledTimes(1);
    fireEvent.press(screen.getByRole('button', { name: 'Browse packs' }));
    expect(onBrowsePacks).toHaveBeenCalledTimes(1);
  });

  it('shows the final card and all ten cards in the binder', async () => {
    const pack = openDemoPack(createDemoPack('pitch-black'));
    const reveal = render(<RevealScreen pack={pack} onRip={jest.fn()} onClose={jest.fn()} />);
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByText('Mega Darkrai ex')).toBeTruthy();
    expect(screen.getByText('CHASE PULL')).toBeTruthy();
    expect(screen.getByText('PACK RECAP')).toBeTruthy();
    expect(screen.getByText('Best pull · Mega Darkrai ex')).toBeTruthy();
    expect(screen.getByText(/Revealed seed/)).toBeTruthy();

    reveal.unmount();
    render(<BinderScreen cards={pack.revealedCards!} />);
    expect(screen.getByText('Mega Darkrai ex')).toBeTruthy();
    expect(screen.getByText('€345.34')).toBeTruthy();
    expect(screen.getAllByText('Pitch Black')).toHaveLength(10);
  });
});
