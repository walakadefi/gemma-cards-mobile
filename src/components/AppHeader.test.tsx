import { fireEvent, render, screen } from '@testing-library/react-native';

import { AppHeader } from './AppHeader';

describe('AppHeader', () => {
  it('opens the profile from its accessible button', () => {
    const onProfilePress = jest.fn();

    render(<AppHeader balance={1000} onProfilePress={onProfilePress} />);
    fireEvent.press(screen.getByRole('button', { name: 'Open profile' }));

    expect(onProfilePress).toHaveBeenCalledTimes(1);
  });
});
