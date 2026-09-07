import { act, fireEvent, render, screen } from '@testing-library/react-native';

import { createDemoPack, openDemoPack } from '../../domain/demoCollection';
import { BinderScreen } from '../binder/BinderScreen';
import { MyPacksScreen } from './MyPacksScreen';
import { RevealScreen } from './RevealScreen';

describe('demo pack flow screens', () => {
  it('shows a sealed pack and opens it', () => {
    const onOpen = jest.fn();
    const pack = createDemoPack('pitch-black');
    render(<MyPacksScreen packs={[pack]} onOpen={onOpen} />);

    expect(screen.getByText('SEALED DEMO PACK')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Open Pitch Black demo pack' }));
    expect(onOpen).toHaveBeenCalledWith(pack.id);
  });

  it('shows canonical pack art and provides an accessible rip action', async () => {
    const onRip = jest.fn();
    const pack = createDemoPack('pitch-black');
    render(<RevealScreen pack={pack} onRip={onRip} onClose={jest.fn()} />);
    await act(async () => { await Promise.resolve(); });

    expect(screen.getByText(/Commitment/)).toBeTruthy();
    expect(screen.getByLabelText('Pitch Black booster pack artwork')).toBeTruthy();
    expect(screen.getByTestId('reveal-close-icon').props.name).toBe('close');
    fireEvent.press(screen.getByRole('button', { name: 'Rip pack' }));
    expect(onRip).toHaveBeenCalledTimes(1);
  });

  it('shows the final card and all ten cards in the binder', async () => {
    const pack = openDemoPack(createDemoPack('pitch-black'));
    const reveal = render(<RevealScreen pack={pack} onRip={jest.fn()} onClose={jest.fn()} />);
    await act(async () => { await Promise.resolve(); });
    expect(screen.getByText('Mega Darkrai ex')).toBeTruthy();
    expect(screen.getByText(/Revealed seed/)).toBeTruthy();

    reveal.unmount();
    render(<BinderScreen cards={pack.revealedCards!} />);
    expect(screen.getByText('Illustration Rare')).toBeTruthy();
    expect(screen.getByText('€345')).toBeTruthy();
    expect(screen.getAllByText('Pitch Black')).toHaveLength(10);
  });
});
