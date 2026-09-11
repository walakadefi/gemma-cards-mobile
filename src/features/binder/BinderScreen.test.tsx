import { fireEvent, render, screen } from '@testing-library/react-native';
import { BinderScreen } from './BinderScreen';
import { DemoCard } from '../../domain/demoCollection';

const cards: DemoCard[] = [
  { id: 'a', name: 'Murkrow', setName: 'Pitch Black', rarity: 'Common', marketValueCents: 80 },
  { id: 'b', name: 'Darkrai', setName: 'Pitch Black', rarity: 'Illustration Rare', marketValueCents: 34534 },
  { id: 'c', name: 'Nami', setName: 'One Piece Heroines', rarity: 'Rare', marketValueCents: 500 },
];

it('keeps collection totals while combining search and rarity filters', () => {
  render(<BinderScreen cards={cards} />);
  expect(screen.getByLabelText('Total collection value €351.14')).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Search collection'), '  PITCH ');
  fireEvent.press(screen.getByRole('button', { name: 'Filter collection: Common' }));
  expect(screen.getByText('1 of 3 cards')).toBeTruthy();
  expect(screen.getByText('Murkrow')).toBeTruthy();
  expect(screen.queryByText('Nami')).toBeNull();
  expect(screen.getByLabelText('Total collection value €351.14')).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Search collection'), 'missing');
  expect(screen.getByText('No matching cards')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: 'Show all cards' }));
  expect(screen.getByText('3 of 3 cards')).toBeTruthy();
});

it('sorts by value without mutating saved collection order', () => {
  render(<BinderScreen cards={cards} />);
  fireEvent.press(screen.getByRole('button', { name: 'Highest value' }));
  expect(screen.getAllByTestId('binder-card')[0].findAllByProps({ children: 'Darkrai' }).length).toBeGreaterThan(0);
  expect(cards.map((card) => card.id)).toEqual(['a', 'b', 'c']);
  fireEvent.press(screen.getByRole('button', { name: 'Collection order' }));
  expect(screen.getAllByTestId('binder-card')[0].findAllByProps({ children: 'Murkrow' }).length).toBeGreaterThan(0);
});

it('previews selected buyback coins across filters without changing the collection', () => {
  render(<BinderScreen cards={cards} />);
  fireEvent.press(screen.getByRole('checkbox', { name: 'Preview buyback for Murkrow' }));
  fireEvent.press(screen.getByRole('checkbox', { name: 'Preview buyback for Darkrai' }));
  expect(screen.getByLabelText('Estimated buyback 25,960 coins')).toBeTruthy();
  fireEvent.changeText(screen.getByLabelText('Search collection'), 'Nami');
  expect(screen.getByText('2 cards selected')).toBeTruthy();
  expect(screen.getByLabelText('Estimated buyback 25,960 coins')).toBeTruthy();
  expect(screen.getByLabelText('Total collection value €351.14')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: 'Clear buyback selection' }));
  expect(screen.getByLabelText('Estimated buyback 0 coins')).toBeTruthy();
  expect(cards).toHaveLength(3);
});

it('excludes removed cards from the buyback preview', () => {
  const { rerender } = render(<BinderScreen cards={cards} />);
  fireEvent.press(screen.getByRole('checkbox', { name: 'Preview buyback for Nami' }));
  expect(screen.getByLabelText('Estimated buyback 375 coins')).toBeTruthy();
  rerender(<BinderScreen cards={cards.slice(0, 2)} />);
  expect(screen.getByLabelText('Estimated buyback 0 coins')).toBeTruthy();
});
