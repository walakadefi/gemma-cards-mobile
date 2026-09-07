import { createDemoPack, openDemoPack } from './demoCollection';
import { expansions } from '../fixtures/catalog';

describe('demo collection', () => {
  it('creates a sealed pack without exposing reveal data', () => {
    const pack = createDemoPack('pitch-black');

    expect(pack.id).toBe('demo-pitch-black');
    expect(pack.status).toBe('sealed');
    expect(pack.commitment).toMatch(/^[a-f0-9]{64}$/);
    expect(pack.revealedCards).toBeUndefined();
    expect(pack.verification).toBeUndefined();
  });

  it('opens a deterministic ten-card fixture with the hit last', () => {
    const sealed = createDemoPack('pitch-black');
    const first = openDemoPack(sealed);
    const second = openDemoPack(createDemoPack('pitch-black'));

    expect(first).toEqual(second);
    expect(first.status).toBe('revealed');
    expect(first.revealedCards).toHaveLength(10);
    expect(first.revealedCards?.[9].name).toBe('Mega Darkrai ex');
    expect(first.verification).toMatchObject({
      commitment: sealed.commitment,
      cardCount: 10,
      algorithmVersion: 'demo-pack-v2',
    });
  });

  it('rejects a pack without fixture outcomes', () => {
    expect(() => openDemoPack(createDemoPack('unknown'))).toThrow('No demo outcome exists for this expansion.');
  });

  it('builds a deterministic ten-card reveal for every catalog expansion', () => {
    expect(expansions).toHaveLength(40);
    expansions.forEach(({ id, topCardValueCents }) => {
      const first = openDemoPack(createDemoPack(id));
      const second = openDemoPack(createDemoPack(id));
      expect(first).toEqual(second);
      expect(first.revealedCards).toHaveLength(10);
      expect(first.revealedCards?.[9].marketValueCents).toBe(topCardValueCents);
    });
  });
});
