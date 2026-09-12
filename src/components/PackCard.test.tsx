import { render, screen } from '@testing-library/react-native';

import { expansions } from '../fixtures/catalog';
import { PackCard } from './PackCard';

it('keeps the three-column pack shelf focused on pack identity and price', () => {
  render(<PackCard expansion={expansions[0]} onPress={jest.fn()} />);

  expect(screen.getByText('Pitch Black')).toBeTruthy();
  expect(screen.getByText('◆ 500')).toBeTruthy();
  expect(screen.queryByText('TOP CARD')).toBeNull();
});
