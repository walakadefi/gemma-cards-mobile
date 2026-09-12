import { DemoCard } from '../../domain/demoCollection';
import { createSwapOffers, createTradeReceipt } from './swapFlow';

const card: DemoCard = {
  id: 'charizard-1',
  name: 'Mega Charizard ex',
  setName: 'Phantasmal Flames',
  rarity: 'Illustration Rare',
  marketValueCents: 114202,
};

describe('swap flow', () => {
  it('builds a balanced offer at the selected card value', () => {
    const offer = createSwapOffers(card)[0];

    expect(offer.valueCents).toBe(card.marketValueCents);
    expect(offer.title).toBe('Fair value trade');
  });

  it('creates a clear receipt for the selected trade', () => {
    const offer = createSwapOffers(card)[1];

    expect(createTradeReceipt(card, offer)).toEqual({
      from: 'Mega Charizard ex',
      to: 'Chase upgrade',
      valueCents: offer.valueCents,
      status: 'Demo trade confirmed',
    });
  });
});
