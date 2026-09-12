import { DemoCard } from '../../domain/demoCollection';

export interface SwapOffer {
  id: 'fair-value' | 'chase-upgrade' | 'safe-bundle';
  title: string;
  description: string;
  valueCents: number;
}

export interface TradeReceipt {
  from: string;
  to: string;
  valueCents: number;
  status: 'Demo trade confirmed';
}

export const createSwapOffers = (card: DemoCard): SwapOffer[] => [
  {
    id: 'fair-value',
    title: 'Fair value trade',
    description: 'A one-for-one trade around today\'s value.',
    valueCents: card.marketValueCents,
  },
  {
    id: 'chase-upgrade',
    title: 'Chase upgrade',
    description: 'Trade up for a higher-ceiling pull.',
    valueCents: Math.round(card.marketValueCents * 1.12),
  },
  {
    id: 'safe-bundle',
    title: 'Safe bundle',
    description: 'Spread the value across several reliable cards.',
    valueCents: Math.round(card.marketValueCents * 0.96),
  },
];

export const createTradeReceipt = (card: DemoCard, offer: SwapOffer): TradeReceipt => ({
  from: card.name,
  to: offer.title,
  valueCents: offer.valueCents,
  status: 'Demo trade confirmed',
});
