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
      />,
    );

    expect(screen.getByRole('header', { name: 'Guest Collector' })).toBeTruthy();
    expect(screen.getByText('PROTOTYPE ACCOUNT')).toBeTruthy();
    expect(screen.getByText('1,000')).toBeTruthy();
    expect(screen.getByText('2 packs')).toBeTruthy();
    expect(screen.getByText('1 opened')).toBeTruthy();
    expect(screen.getByText('10 cards')).toBeTruthy();
    expect(screen.getByText('€386')).toBeTruthy();
    expect(screen.getByText(/stored only for this session/i)).toBeTruthy();
  });

  it('closes from its accessible close button', () => {
    const onClose = jest.fn();
    render(<ProfileScreen balance={1000} packs={[]} cards={[]} onClose={onClose} />);

    expect(screen.getByTestId('profile-close-icon').props.name).toBe('close');
    fireEvent.press(screen.getByRole('button', { name: 'Close profile' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
