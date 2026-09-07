import { fireEvent, render, screen } from '@testing-library/react-native';

import { ShopScreen } from './ShopScreen';

describe('ShopScreen', () => {
  it('filters the visible expansion cards by game', () => {
    render(<ShopScreen onOpenPack={() => undefined} />);

    expect(screen.getByText('Pitch Black')).toBeTruthy();
    expect(screen.getByText('The Time of Battle')).toBeTruthy();
    expect(screen.getByText('Chaos Rising')).toBeTruthy();
    expect(screen.getByText('Perfect Order')).toBeTruthy();
    expect(screen.getByText('One Piece Heroines')).toBeTruthy();
    expect(screen.getByText("The Azure Sea's Seven")).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Show One Piece packs' }));

    expect(screen.queryByText('Pitch Black')).toBeNull();
    expect(screen.getByText('The Time of Battle')).toBeTruthy();
  });
});
