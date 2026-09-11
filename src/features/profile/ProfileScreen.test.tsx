import { fireEvent, render, screen } from '@testing-library/react-native';

import { createDemoPack, openDemoPack } from '../../domain/demoCollection';
import { ProfileScreen } from './ProfileScreen';

describe('ProfileScreen', () => {
  it('shows the guest identity and live collection summary', () => {
    const sealedPack = createDemoPack('ascended-heroes');
    const openedPack = openDemoPack(createDemoPack('pitch-black'));

    render(
      <ProfileScreen
        balance={1000}
        packs={[sealedPack, openedPack]}
        cards={openedPack.revealedCards ?? []}
        onClose={jest.fn()}
        onReset={jest.fn()}
      />,
    );

    expect(screen.getByRole('header', { name: 'Guest Collector' })).toBeTruthy();
    expect(screen.getByText('PROTOTYPE ACCOUNT')).toBeTruthy();
    expect(screen.getByText('1,000')).toBeTruthy();
    expect(screen.getByText('2 packs')).toBeTruthy();
    expect(screen.getByText('1 opened')).toBeTruthy();
    expect(screen.getByText('10 cards')).toBeTruthy();
    expect(screen.getByText('€386.74')).toBeTruthy();
    expect(screen.getByText('Mega Darkrai ex')).toBeTruthy();
    expect(screen.getByText(/stored locally on this device/i)).toBeTruthy();
  });

  it('closes from its accessible close button', () => {
    const onClose = jest.fn();
    render(<ProfileScreen balance={1000} packs={[]} cards={[]} onClose={onClose} onReset={jest.fn()} />);

    expect(screen.getByTestId('profile-close-icon').props.name).toBe('close');
    fireEvent.press(screen.getByRole('button', { name: 'Close profile' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('requires a deliberate confirmation before resetting the local collection', () => {
    const onReset = jest.fn();
    render(<ProfileScreen balance={1000} packs={[]} cards={[]} onClose={jest.fn()} onReset={onReset} />);

    fireEvent.press(screen.getByRole('button', { name: 'Reset demo collection' }));

    expect(onReset).not.toHaveBeenCalled();
    expect(screen.getByRole('alert')).toHaveTextContent(/cannot be undone/i);
    fireEvent.press(screen.getByRole('button', { name: 'Confirm reset demo collection' }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });
});
