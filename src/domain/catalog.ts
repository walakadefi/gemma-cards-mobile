export type Game = 'pokemon' | 'onepiece';
export type GameFilter = 'all' | Game;

export interface OddsTier {
  label: string;
  chancePercent: number;
  minimumValueCents: number;
}

export interface Expansion {
  id: string;
  game: Game;
  name: string;
  code: string;
  coinPrice: number;
  topCardValueCents: number;
  volatility: 1 | 2 | 3 | 4 | 5;
  accent: string;
  description: string;
  imageUri: string;
  odds: OddsTier[];
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
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents / 100);
