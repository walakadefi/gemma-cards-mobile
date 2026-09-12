import { createDemoPack, openDemoPack } from '../../domain/demoCollection';
import { createProfileSummary } from './profileSummary';

describe('createProfileSummary', () => {
  it('calculates collection totals from sealed and opened packs', () => {
    const sealedPack = createDemoPack('ascended-heroes');
    const openedPack = openDemoPack(createDemoPack('pitch-black'));

    expect(createProfileSummary([sealedPack, openedPack], openedPack.revealedCards ?? [], 1000)).toEqual({
      balance: 1000,
      packCount: 2,
      openedPackCount: 1,
      cardCount: 10,
      collectionValueCents: 38674,
      bestPullName: 'Mega Darkrai ex',
      collectionGoal: { title: 'Build a 25-card Binder', current: 10, target: 25 },
    });
  });

  it('returns zero collection totals for a new guest', () => {
    expect(createProfileSummary([], [], 1000)).toEqual({
      balance: 1000,
      packCount: 0,
      openedPackCount: 0,
      cardCount: 0,
      collectionValueCents: 0,
      collectionGoal: { title: 'Build a 10-card Binder', current: 0, target: 10 },
    });
  });

  it('sets the next collection goal from the number of cards collected', () => {
    const openedPack = openDemoPack(createDemoPack('pitch-black'));
    const summary = createProfileSummary([openedPack], openedPack.revealedCards ?? [], 1000);

    expect(summary.collectionGoal).toEqual({ title: 'Build a 25-card Binder', current: 10, target: 25 });
  });
});
