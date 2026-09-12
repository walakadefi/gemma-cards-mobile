import { fireEvent, render, screen } from '@testing-library/react-native';

import { shopGridColumns, ShopScreen } from './ShopScreen';

const recentCards = [{ id: 'recent-1', name: 'Mega Darkrai ex', setName: 'Pitch Black', rarity: 'Illustration Rare' as const, marketValueCents: 34534 }];

describe('ShopScreen', () => {
  it('keeps three pack slots across the shop grid on phone-sized screens', () => {
    expect(shopGridColumns(320)).toBe(3);
    expect(shopGridColumns(390)).toBe(3);
  });

  it('starts the featured first rip directly from the welcome panel', () => {
    const onOpenPack = jest.fn();
    render(<ShopScreen onOpenPack={onOpenPack} />);
    fireEvent.press(screen.getByRole('button', { name: 'Start your first rip' }));
    expect(onOpenPack).toHaveBeenCalledWith('pitch-black');
  });

  it('sends returning collectors straight to their sealed packs', () => {
    const onViewMyPacks = jest.fn();
    render(<ShopScreen onOpenPack={jest.fn()} sealedPackCount={2} onViewMyPacks={onViewMyPacks} />);

    expect(screen.getByText('2 packs ready to rip')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'View ready packs' }));
    expect(onViewMyPacks).toHaveBeenCalledTimes(1);
  });

  it('puts the featured drop and latest pull ahead of the catalog', () => {
    render(<ShopScreen onOpenPack={() => undefined} recentCards={recentCards} />);

    expect(screen.getByText('FEATURED DROP')).toBeTruthy();
    expect(screen.getAllByText('Pitch Black').length).toBeGreaterThan(0);
    expect(screen.getByText('RECENTLY PULLED')).toBeTruthy();
    expect(screen.getByText('Mega Darkrai ex')).toBeTruthy();
  });

  it('filters the visible expansion cards by game', () => {
    render(<ShopScreen onOpenPack={() => undefined} />);

    expect(screen.getByText('40 sets')).toBeTruthy();
    expect(screen.getAllByText('Pitch Black').length).toBeGreaterThan(0);

    fireEvent.press(screen.getByRole('button', { name: 'Show One Piece packs' }));

    expect(screen.getByText('19 sets')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Open Pitch Black details' })).toBeNull();
    expect(screen.getByText('The Time of Battle')).toBeTruthy();
    expect(screen.getByText('One Piece Heroines')).toBeTruthy();
  });

  it('searches by pack name or set code and clears an empty result', () => {
    render(<ShopScreen onOpenPack={() => undefined} />);

    fireEvent.changeText(screen.getByLabelText('Search packs'), 'OP01');

    expect(screen.getByText('1 set')).toBeTruthy();
    expect(screen.getByText('Romance Dawn')).toBeTruthy();
    expect(screen.queryByRole('button', { name: 'Open Pitch Black details' })).toBeNull();

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
