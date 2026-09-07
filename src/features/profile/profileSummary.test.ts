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
    });
  });

  it('returns zero collection totals for a new guest', () => {
    expect(createProfileSummary([], [], 1000)).toEqual({
      balance: 1000,
      packCount: 0,
      openedPackCount: 0,
      cardCount: 0,
      collectionValueCents: 0,
    });
  });
});
