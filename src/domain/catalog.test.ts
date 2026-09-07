import { expansions } from '../fixtures/catalog';
import { filterExpansions, formatCoins, formatEuro } from './catalog';

describe('catalog helpers', () => {
  it('matches Gemma latest shelf ordering and source-backed pack facts', () => {
    expect(expansions.map(({ name, code, coinPrice, topCardValueCents }) => ({ name, code, coinPrice, topCardValueCents }))).toEqual([
      { name: 'Pitch Black', code: 'PBL', coinPrice: 500, topCardValueCents: 34534 },
      { name: 'The Time of Battle', code: 'OP16', coinPrice: 500, topCardValueCents: 144246 },
      { name: 'Chaos Rising', code: 'CRI', coinPrice: 500, topCardValueCents: 26138 },
      { name: "Adventure on Kami's Island", code: 'OP15', coinPrice: 500, topCardValueCents: 134274 },
      { name: 'Perfect Order', code: 'POR', coinPrice: 500, topCardValueCents: 14524 },
      { name: 'One Piece Heroines', code: 'EB03', coinPrice: 1000, topCardValueCents: 244989 },
      { name: 'Ascended Heroes', code: 'ASC', coinPrice: 500, topCardValueCents: 131884 },
      { name: "The Azure Sea's Seven", code: 'OP14', coinPrice: 500, topCardValueCents: 174719 },
    ]);
  });

  it('filters Pokemon independently from One Piece', () => {
    expect(filterExpansions(expansions, 'pokemon').every((item) => item.game === 'pokemon')).toBe(true);
    expect(filterExpansions(expansions, 'onepiece').every((item) => item.game === 'onepiece')).toBe(true);
  });

  it('formats exact euro values from Gemma', () => {
    expect(formatCoins(1000)).toBe('1,000');
    expect(formatEuro(144246)).toBe('€1,442.46');
  });

  it('uses canonical Gemma pack artwork for every expansion', () => {
    expect(expansions.every((item) => item.imageUri === `https://www.gemma.cards/cards/packs/${item.code.toLowerCase()}.webp`)).toBe(true);
  });
});
