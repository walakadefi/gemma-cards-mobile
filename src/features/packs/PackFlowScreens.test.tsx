import { fireEvent, render, screen } from '@testing-library/react-native';

import { createDemoPack, revealDemoPack } from '../../domain/demoCollection';
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

  it('shows commitment before reveal and uses the chosen position', () => {
    const onReveal = jest.fn();
    const pack = createDemoPack('pitch-black');
    render(<RevealScreen pack={pack} onReveal={onReveal} onClose={jest.fn()} />);

    expect(screen.getByText(/Commitment/)).toBeTruthy();
    expect(screen.queryByText('Umbreon ex')).toBeNull();
    fireEvent.press(screen.getByRole('button', { name: 'Choose pack position 2' }));
    fireEvent.press(screen.getByRole('button', { name: 'Reveal selected demo pack' }));
    expect(onReveal).toHaveBeenCalledWith(1);
  });

  it('shows the revealed card and verification seed in the binder flow', () => {
    const pack = revealDemoPack(createDemoPack('pitch-black'), 1);
    const reveal = render(<RevealScreen pack={pack} onReveal={jest.fn()} onClose={jest.fn()} />);
    expect(screen.getAllByText('Umbreon ex')).toHaveLength(2);
    expect(screen.getByText(/Revealed seed/)).toBeTruthy();

    reveal.unmount();
    render(<BinderScreen cards={[pack.revealedCard!]} />);
    expect(screen.getByText('Illustration Rare')).toBeTruthy();
    expect(screen.getByText('€345')).toBeTruthy();
  });
});
