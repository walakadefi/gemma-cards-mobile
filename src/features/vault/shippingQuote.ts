import { DemoCard } from '../../domain/demoCollection';

// Gemma shipping page, checked 2026-09-11. All amounts are euro cents.
export function shippingQuote(cards: DemoCard[]) {
  const standardCount = cards.filter((card) => card.marketValueCents >= 1000).length;
  const smallCount = cards.length - standardCount;
  const baseCents = standardCount > 0 ? 1000 : 0;
  const extraCents = Math.max(0, standardCount - 3) * 500;
  const smallCents = smallCount * 500;
  return { standardCount, smallCount, baseCents, extraCents, smallCents, totalCents: baseCents + extraCents + smallCents };
}
