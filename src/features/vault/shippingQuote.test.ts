import { DemoCard } from '../../domain/demoCollection';
import { shippingQuote } from './shippingQuote';

it.each([
  [[], 0], [[999], 500], [[1000], 1000], [[1000, 1000, 1000], 1000],
  [[1000, 1000, 1000, 1000], 1500], [[999, 999, 1000, 1000, 1000], 2000],
])('quotes shipping for values %j', (values, expected) => {
  const cards: DemoCard[] = values.map((value, index) => ({ id: String(index), name: 'Card', setName: 'Set', rarity: 'Common', marketValueCents: value }));
  expect(shippingQuote(cards).totalCents).toBe(expected);
});
