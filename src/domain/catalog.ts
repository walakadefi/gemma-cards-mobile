export type Game = 'pokemon' | 'onepiece';
export type GameFilter = 'all' | Game;
export type ExpansionSort = 'newest' | 'price' | 'top-value';

export interface Expansion {
  id: string;
  game: Game;
  name: string;
  code: string;
  coinPrice: number;
  topCardValueCents: number;
  accent: string;
  description: string;
  imageUri: string;
}

export const filterExpansions = (items: Expansion[], filter: GameFilter): Expansion[] => {
  if (filter === 'all') {
    return items;
  }

  return items.filter((item) => item.game === filter);
};

interface BrowseExpansionsOptions {
  filter: GameFilter;
  query: string;
  sort: ExpansionSort;
}

export const browseExpansions = (items: Expansion[], options: BrowseExpansionsOptions): Expansion[] => {
  const query = options.query.trim().toLocaleLowerCase();
  const indexedItems = filterExpansions(items, options.filter)
    .map((item) => ({ item, sourceIndex: items.indexOf(item) }))
    .filter(({ item }) => !query || item.name.toLocaleLowerCase().includes(query) || item.code.toLocaleLowerCase().includes(query));

  return indexedItems
    .sort((left, right) => {
      if (options.sort === 'price') {
        return left.item.coinPrice - right.item.coinPrice || left.sourceIndex - right.sourceIndex;
      }
      if (options.sort === 'top-value') {
        return right.item.topCardValueCents - left.item.topCardValueCents || left.sourceIndex - right.sourceIndex;
      }
      return left.sourceIndex - right.sourceIndex;
    })
    .map(({ item }) => item);
};

export const formatCoins = (coins: number): string =>
  new Intl.NumberFormat('en-US', { useGrouping: true }).format(coins);

export const formatEuro = (cents: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
