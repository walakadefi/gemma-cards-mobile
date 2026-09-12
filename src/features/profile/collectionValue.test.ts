import { formatEuro } from '../../domain/catalog';
import { collectionValueA11yLabel } from './collectionValue';

it('describes the animated collection total accessibly', () => {
  expect(collectionValueA11yLabel(38674)).toBe(`Animated collection value ${formatEuro(38674)}`);
});
