export type CardRarity = 'Common' | 'Rare' | 'Illustration Rare';

export interface DemoCard {
  id: string;
  name: string;
  setName: string;
  rarity: CardRarity;
  marketValueCents: number;
}

export interface RevealVerification {
  commitment: string;
  revealedSeed: string;
  selectedIndex: number;
  algorithmVersion: 'demo-fixture-v1';
  previousChainFingerprint: string;
}

export interface DemoPack {
  id: string;
  expansionId: string;
  status: 'sealed' | 'revealed';
  commitment: string;
  revealedCard?: DemoCard;
  verification?: RevealVerification;
}

const outcomes: Record<string, DemoCard[]> = {
  'pitch-black': [
    { id: 'pbl-001', name: 'Murkrow', setName: 'Pitch Black', rarity: 'Common', marketValueCents: 120 },
    { id: 'pbl-177', name: 'Umbreon ex', setName: 'Pitch Black', rarity: 'Illustration Rare', marketValueCents: 34500 },
    { id: 'pbl-084', name: 'Darkrai', setName: 'Pitch Black', rarity: 'Rare', marketValueCents: 780 },
  ],
  'ascended-heroes': [
    { id: 'asc-014', name: 'Riolu', setName: 'Ascended Heroes', rarity: 'Common', marketValueCents: 90 },
    { id: 'asc-191', name: 'Lucario ex', setName: 'Ascended Heroes', rarity: 'Illustration Rare', marketValueCents: 131900 },
    { id: 'asc-105', name: 'Dragonite', setName: 'Ascended Heroes', rarity: 'Rare', marketValueCents: 1250 },
  ],
  'phantasmal-flames': [
    { id: 'pfl-021', name: 'Litwick', setName: 'Phantasmal Flames', rarity: 'Common', marketValueCents: 80 },
    { id: 'pfl-188', name: 'Charizard ex', setName: 'Phantasmal Flames', rarity: 'Illustration Rare', marketValueCents: 114200 },
    { id: 'pfl-093', name: 'Chandelure', setName: 'Phantasmal Flames', rarity: 'Rare', marketValueCents: 940 },
  ],
  'time-of-battle': [
    { id: 'op16-018', name: 'Koby', setName: 'The Time of Battle', rarity: 'Common', marketValueCents: 110 },
    { id: 'op16-119', name: 'Monkey D. Luffy', setName: 'The Time of Battle', rarity: 'Illustration Rare', marketValueCents: 144200 },
    { id: 'op16-072', name: 'Trafalgar Law', setName: 'The Time of Battle', rarity: 'Rare', marketValueCents: 1680 },
  ],
  'kamis-island': [
    { id: 'op15-009', name: 'Nami', setName: "Adventure on Kami's Island", rarity: 'Common', marketValueCents: 130 },
    { id: 'op15-121', name: 'Enel', setName: "Adventure on Kami's Island", rarity: 'Illustration Rare', marketValueCents: 134300 },
    { id: 'op15-061', name: 'Roronoa Zoro', setName: "Adventure on Kami's Island", rarity: 'Rare', marketValueCents: 1520 },
  ],
  'carrying-on-his-will': [
    { id: 'op13-006', name: 'Sabo', setName: 'Carrying on His Will', rarity: 'Common', marketValueCents: 140 },
    { id: 'op13-118', name: 'Gol D. Roger', setName: 'Carrying on His Will', rarity: 'Illustration Rare', marketValueCents: 3251900 },
    { id: 'op13-044', name: 'Portgas D. Ace', setName: 'Carrying on His Will', rarity: 'Rare', marketValueCents: 2100 },
  ],
};

const fixtureHex = (value: string): string => {
  let state = 2166136261;
  let result = '';
  for (let block = 0; block < 8; block += 1) {
    for (let index = 0; index < value.length; index += 1) {
      state ^= value.charCodeAt(index) + block;
      state = Math.imul(state, 16777619);
    }
    result += (state >>> 0).toString(16).padStart(8, '0');
  }
  return result;
};

export const createDemoPack = (expansionId: string): DemoPack => ({
  id: `demo-${expansionId}`,
  expansionId,
  status: 'sealed',
  commitment: fixtureHex(`commitment:${expansionId}:demo-fixture-v1`),
});

export const revealDemoPack = (pack: DemoPack, selectedIndex: number): DemoPack => {
  if (pack.status === 'revealed') return pack;
  if (![0, 1, 2].includes(selectedIndex)) throw new Error('Pack position must be 0, 1, or 2.');
  const revealedCard = outcomes[pack.expansionId]?.[selectedIndex];
  if (!revealedCard) throw new Error('No demo outcome exists for this expansion.');

  return {
    ...pack,
    status: 'revealed',
    revealedCard,
    verification: {
      commitment: pack.commitment,
      revealedSeed: fixtureHex(`seed:${pack.expansionId}:${selectedIndex}:demo-fixture-v1`),
      selectedIndex,
      algorithmVersion: 'demo-fixture-v1',
      previousChainFingerprint: fixtureHex('gemma-demo-chain-origin'),
    },
  };
};
