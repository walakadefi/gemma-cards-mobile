import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  it('opens the profile from its accessible button', () => {
    const onProfilePress = jest.fn();

    render(<AppHeader balance={1000} onProfilePress={onProfilePress} />);
    expect(screen.getByTestId('header-coin-icon').props.name).toBe('diamond');
    expect(screen.getByTestId('header-profile-icon').props.name).toBe('person-outline');
    fireEvent.press(screen.getByRole('button', { name: 'Open profile' }));

    expect(onProfilePress).toHaveBeenCalledTimes(1);
  });
});
