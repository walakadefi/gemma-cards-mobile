import { createDemoPack, openDemoPack } from '../domain/demoCollection';
import { loadDemoCollection, saveDemoCollection } from './collectionStorage';

function createStorage(initialValue: string | null = null) {
  let value = initialValue;
  return {
    getItem: jest.fn(async () => value),
    setItem: jest.fn(async (_key: string, nextValue: string) => { value = nextValue; }),
  };
}

describe('demo collection storage', () => {
  it('round-trips sealed and revealed packs in a versioned payload', async () => {
    const storage = createStorage();
    const packs = [createDemoPack('pitch-black'), openDemoPack(createDemoPack('ascended-heroes'))];

    await saveDemoCollection(storage, packs);

    await expect(loadDemoCollection(storage)).resolves.toEqual(packs);
    expect(JSON.parse(storage.setItem.mock.calls[0][1])).toEqual({ version: 1, packs });
  });

  it.each([
    null,
    'not-json',
    JSON.stringify({ version: 2, packs: [] }),
    JSON.stringify({ version: 1, packs: [{ id: 42 }] }),
  ])('falls back to an empty collection for missing or invalid data', async (storedValue) => {
    await expect(loadDemoCollection(createStorage(storedValue))).resolves.toEqual([]);
  });

  it('falls back safely when device storage cannot be read', async () => {
    const storage = { getItem: jest.fn(async () => { throw new Error('unavailable'); }), setItem: jest.fn() };

    await expect(loadDemoCollection(storage)).resolves.toEqual([]);
  });
});
