export type Game = 'pokemon' | 'onepiece';
export type GameFilter = 'all' | Game;

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

export const formatCoins = (coins: number): string =>
  new Intl.NumberFormat('en-US', { useGrouping: true }).format(coins);

export const formatEuro = (cents: number): string =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(cents / 100);
