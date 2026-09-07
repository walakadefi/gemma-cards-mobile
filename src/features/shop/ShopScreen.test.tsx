import { fireEvent, render, screen } from '@testing-library/react-native';

import { ShopScreen } from './ShopScreen';

describe('ShopScreen', () => {
  it('filters the visible expansion cards by game', () => {
    render(<ShopScreen onOpenPack={() => undefined} />);

    expect(screen.getByText('40 sets')).toBeTruthy();
    expect(screen.getByText('Pitch Black')).toBeTruthy();

    fireEvent.press(screen.getByRole('button', { name: 'Show One Piece packs' }));

    expect(screen.getByText('19 sets')).toBeTruthy();
    expect(screen.queryByText('Pitch Black')).toBeNull();
    expect(screen.getByText('The Time of Battle')).toBeTruthy();
    expect(screen.getByText('One Piece Heroines')).toBeTruthy();
  });

  it('searches by pack name or set code and clears an empty result', () => {
    render(<ShopScreen onOpenPack={() => undefined} />);

    fireEvent.changeText(screen.getByLabelText('Search packs'), 'OP01');

    expect(screen.getByText('1 set')).toBeTruthy();
    expect(screen.getByText('Romance Dawn')).toBeTruthy();
    expect(screen.queryByText('Pitch Black')).toBeNull();

    fireEvent.changeText(screen.getByLabelText('Search packs'), 'not a real pack');

    expect(screen.getByText('No packs found')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Clear pack search' }));
    expect(screen.getByText('40 sets')).toBeTruthy();
  });

  it('sorts packs by top-card value', () => {
    render(<ShopScreen onOpenPack={() => undefined} />);

    fireEvent.press(screen.getByRole('button', { name: 'Sort by top card value' }));

    const packButtons = screen.getAllByRole('button').filter((button) => String(button.props.accessibilityLabel).endsWith(' details'));
    expect(packButtons[0].props.accessibilityLabel).toBe('Open Carrying on His Will details');
    expect(screen.getByRole('button', { name: 'Sort by top card value' }).props.accessibilityState).toEqual({ selected: true });
  });
});
