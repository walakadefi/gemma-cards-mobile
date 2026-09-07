import { expansions } from '../fixtures/catalog';
import { filterExpansions, formatCoins, formatEuro } from './catalog';

describe('catalog helpers', () => {
  it('filters Pokemon independently from One Piece', () => {
    expect(filterExpansions(expansions, 'pokemon').every((item) => item.game === 'pokemon')).toBe(true);
    expect(filterExpansions(expansions, 'onepiece').every((item) => item.game === 'onepiece')).toBe(true);
  });

  it('formats integer values for the interface', () => {
    expect(formatCoins(1000)).toBe('1,000');
    expect(formatEuro(144200)).toBe('€1,442');
  });
});
