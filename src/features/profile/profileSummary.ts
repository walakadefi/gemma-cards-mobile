import { DemoCard, DemoPack } from '../../domain/demoCollection';

export interface ProfileSummary {
  balance: number;
  packCount: number;
  openedPackCount: number;
  cardCount: number;
  collectionValueCents: number;
}

export function createProfileSummary(packs: DemoPack[], cards: DemoCard[], balance: number): ProfileSummary {
  return {
    balance,
    packCount: packs.length,
    openedPackCount: packs.filter((pack) => pack.status === 'revealed').length,
    cardCount: cards.length,
    collectionValueCents: cards.reduce((total, card) => total + card.marketValueCents, 0),
  };
}
