import { expansions } from '../fixtures/catalog';
import { browseExpansions, filterExpansions, formatCoins, formatEuro } from './catalog';

describe('catalog helpers', () => {
  it('matches all 40 Gemma packs in live catalog order with source-backed facts', () => {
    expect(expansions.map(({ name, code, coinPrice, topCardValueCents }) => ({ name, code, coinPrice, topCardValueCents }))).toEqual([
      { name: 'Pitch Black', code: 'PBL', coinPrice: 500, topCardValueCents: 34534 },
      { name: 'Ascended Heroes', code: 'ASC', coinPrice: 500, topCardValueCents: 131884 },
      { name: 'Chaos Rising', code: 'CRI', coinPrice: 500, topCardValueCents: 26138 },
      { name: 'Perfect Order', code: 'POR', coinPrice: 500, topCardValueCents: 14524 },
      { name: 'Phantasmal Flames', code: 'PFL', coinPrice: 500, topCardValueCents: 114202 },
      { name: 'Mega Evolution', code: 'MEG', coinPrice: 500, topCardValueCents: 30554 },
      { name: 'Destined Rivals', code: 'DRI', coinPrice: 500, topCardValueCents: 76289 },
      { name: 'Prismatic Evolutions', code: 'PRE', coinPrice: 500, topCardValueCents: 139271 },
      { name: 'White Flare', code: 'WHT', coinPrice: 500, topCardValueCents: 63185 },
      { name: 'Black Bolt', code: 'BLK', coinPrice: 1000, topCardValueCents: 72094 },
      { name: 'Journey Together', code: 'JTG', coinPrice: 500, topCardValueCents: 14346 },
      { name: 'Surging Sparks', code: 'SSP', coinPrice: 500, topCardValueCents: 27350 },
      { name: 'Stellar Crown', code: 'SCR', coinPrice: 500, topCardValueCents: 11360 },
      { name: 'Shrouded Fable', code: 'SFA', coinPrice: 500, topCardValueCents: 8210 },
      { name: 'Twilight Masquerade', code: 'TWM', coinPrice: 500, topCardValueCents: 28197 },
      { name: 'Temporal Forces', code: 'TEF', coinPrice: 500, topCardValueCents: 11988 },
      { name: 'Paradox Rift', code: 'PAR', coinPrice: 500, topCardValueCents: 20868 },
      { name: 'Pokémon 151', code: 'MEW', coinPrice: 1000, topCardValueCents: 44663 },
      { name: 'Obsidian Flames', code: 'OBF', coinPrice: 500, topCardValueCents: 12064 },
      { name: 'Paldea Evolved', code: 'PAL', coinPrice: 1000, topCardValueCents: 34336 },
      { name: 'Scarlet & Violet', code: 'SVI', coinPrice: 500, topCardValueCents: 9197 },
      { name: 'The Time of Battle', code: 'OP16', coinPrice: 500, topCardValueCents: 144246 },
      { name: "Adventure on Kami's Island", code: 'OP15', coinPrice: 500, topCardValueCents: 134274 },
      { name: "The Azure Sea's Seven", code: 'OP14', coinPrice: 500, topCardValueCents: 174719 },
      { name: 'One Piece Heroines', code: 'EB03', coinPrice: 1000, topCardValueCents: 244989 },
      { name: 'Carrying on His Will', code: 'OP13', coinPrice: 500, topCardValueCents: 3251886 },
      { name: 'Legacy of the Master', code: 'OP12', coinPrice: 500, topCardValueCents: 247845 },
      { name: 'Anime 25th Collection', code: 'EB02', coinPrice: 1000, topCardValueCents: 650999 },
      { name: 'A Fist of Divine Speed', code: 'OP11', coinPrice: 500, topCardValueCents: 1147703 },
      { name: 'Royal Blood', code: 'OP10', coinPrice: 500, topCardValueCents: 94310 },
      { name: 'Emperors in the New World', code: 'OP09', coinPrice: 500, topCardValueCents: 1486376 },
      { name: 'Two Legends', code: 'OP08', coinPrice: 500, topCardValueCents: 70605 },
      { name: '500 Years in the Future', code: 'OP07', coinPrice: 500, topCardValueCents: 245697 },
      { name: 'Memorial Collection', code: 'EB01', coinPrice: 1000, topCardValueCents: 406871 },
      { name: 'Wings of the Captain', code: 'OP06', coinPrice: 500, topCardValueCents: 419069 },
      { name: 'Awakening of the New Era', code: 'OP05', coinPrice: 500, topCardValueCents: 1464310 },
      { name: 'Kingdoms of Intrigue', code: 'OP04', coinPrice: 500, topCardValueCents: 185980 },
      { name: 'Pillars of Strength', code: 'OP03', coinPrice: 500, topCardValueCents: 99487 },
      { name: 'Paramount War', code: 'OP02', coinPrice: 500, topCardValueCents: 237586 },
      { name: 'Romance Dawn', code: 'OP01', coinPrice: 500, topCardValueCents: 505490 },
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

  it('searches pack names and set codes without case or surrounding whitespace', () => {
    expect(browseExpansions(expansions, { filter: 'all', query: '  op01 ', sort: 'newest' }).map((item) => item.name)).toEqual(['Romance Dawn']);
    expect(browseExpansions(expansions, { filter: 'all', query: 'PrIsMaTiC', sort: 'newest' }).map((item) => item.code)).toEqual(['PRE']);
  });

  it('combines game filters with search', () => {
    expect(browseExpansions(expansions, { filter: 'pokemon', query: 'royal', sort: 'newest' })).toEqual([]);
    expect(browseExpansions(expansions, { filter: 'onepiece', query: 'royal', sort: 'newest' }).map((item) => item.code)).toEqual(['OP10']);
  });

  it('sorts by lowest price or highest top-card value while preserving source order for ties', () => {
    const sample = [expansions[9], expansions[0], expansions[1]];

    expect(browseExpansions(sample, { filter: 'all', query: '', sort: 'newest' }).map((item) => item.code)).toEqual(['BLK', 'PBL', 'ASC']);
    expect(browseExpansions(sample, { filter: 'all', query: '', sort: 'price' }).map((item) => item.code)).toEqual(['PBL', 'ASC', 'BLK']);
    expect(browseExpansions(sample, { filter: 'all', query: '', sort: 'top-value' }).map((item) => item.code)).toEqual(['ASC', 'BLK', 'PBL']);
  });

  it('uses canonical Gemma pack artwork for every expansion', () => {
    expect(expansions.every((item) => item.imageUri === `https://www.gemma.cards/cards/packs/${item.code.toLowerCase()}.webp`)).toBe(true);
  });
});
