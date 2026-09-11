import { fireEvent, render, screen } from '@testing-library/react-native';
import { VaultScreen } from './VaultScreen';

it('updates the shipping preview when cards are selected and cleared', () => {
  render(<VaultScreen cards={[
    { id: 'a', name: 'Darkrai', setName: 'Pitch Black', rarity: 'Rare', marketValueCents: 1000 },
    { id: 'b', name: 'Murkrow', setName: 'Pitch Black', rarity: 'Common', marketValueCents: 80 },
  ]} />);
  expect(screen.getByText('€0.00')).toBeTruthy();
  fireEvent.press(screen.getByRole('checkbox', { name: 'Select Darkrai for shipping' }));
  fireEvent.press(screen.getByRole('checkbox', { name: 'Select Murkrow for shipping' }));
  expect(screen.getByText('€15.00')).toBeTruthy();
  expect(screen.getByText('2 cards selected')).toBeTruthy();
  fireEvent.press(screen.getByRole('button', { name: 'Clear selection' }));
  expect(screen.getByText('€0.00')).toBeTruthy();
});
