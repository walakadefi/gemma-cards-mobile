import { DemoCard, DemoPack } from '../../domain/demoCollection';

export interface ProfileSummary {
  balance: number;
  packCount: number;
  openedPackCount: number;
  cardCount: number;
  collectionValueCents: number;
  bestPullName?: string;
  bestPullSetName?: string;
  collectionGoal: { title: string; current: number; target: number };
  achievements: { id: string; title: string; unlocked: boolean }[];
}

export function createProfileSummary(packs: DemoPack[], cards: DemoCard[], balance: number): ProfileSummary {
  const cardCount = cards.length;
  const target = cardCount < 10 ? 10 : cardCount < 25 ? 25 : cardCount < 50 ? 50 : 100;
  const bestPull = cards.reduce<DemoCard | undefined>((best, card) => !best || card.marketValueCents > best.marketValueCents ? card : best, undefined);
  return {
    balance,
    packCount: packs.length,
    openedPackCount: packs.filter((pack) => pack.status === 'revealed').length,
    cardCount,
    collectionValueCents: cards.reduce((total, card) => total + card.marketValueCents, 0),
    bestPullName: bestPull?.name,
    bestPullSetName: bestPull?.setName,
    collectionGoal: { title: `Build a ${target}-card Binder`, current: cardCount, target },
    achievements: [
      { id: 'first-rip', title: 'First rip', unlocked: packs.some((pack) => pack.status === 'revealed') },
      { id: 'binder-ten', title: 'Binder builder', unlocked: cardCount >= 10 },
      { id: 'chase-pull', title: 'Chase pull', unlocked: cards.some((card) => card.rarity === 'Illustration Rare') },
    ],
  };
}
