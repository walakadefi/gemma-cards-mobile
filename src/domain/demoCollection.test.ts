import { createDemoPack, revealDemoPack } from './demoCollection';

describe('demo collection', () => {
  it('creates a sealed pack without exposing reveal data', () => {
    const pack = createDemoPack('pitch-black');

    expect(pack.id).toBe('demo-pitch-black');
    expect(pack.status).toBe('sealed');
    expect(pack.commitment).toMatch(/^[a-f0-9]{64}$/);
    expect(pack.revealedCard).toBeUndefined();
    expect(pack.verification).toBeUndefined();
  });

  it('reveals a deterministic fixture for the chosen slot', () => {
    const sealed = createDemoPack('pitch-black');
    const first = revealDemoPack(sealed, 1);
    const second = revealDemoPack(createDemoPack('pitch-black'), 1);

    expect(first).toEqual(second);
    expect(first.status).toBe('revealed');
    expect(first.revealedCard?.name).toBe('Umbreon ex');
    expect(first.verification).toMatchObject({
      commitment: sealed.commitment,
      selectedIndex: 1,
      algorithmVersion: 'demo-fixture-v1',
    });
  });

  it('rejects a slot outside the three demo positions', () => {
    expect(() => revealDemoPack(createDemoPack('pitch-black'), 3)).toThrow('Pack position must be 0, 1, or 2.');
  });
});
