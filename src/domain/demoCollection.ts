export type CardRarity = 'Common' | 'Rare' | 'Illustration Rare';
export interface DemoCard { id: string; name: string; setName: string; rarity: CardRarity; marketValueCents: number; }
export interface RevealVerification { commitment: string; revealedSeed: string; cardCount: 10; algorithmVersion: 'demo-pack-v2'; previousChainFingerprint: string; }
export interface DemoPack { id: string; expansionId: string; status: 'sealed' | 'revealed'; commitment: string; revealedCards?: DemoCard[]; verification?: RevealVerification; }

const sets: Record<string, { code: string; name: string; cards: string[]; hit: string; hitValue: number }> = {
  'pitch-black': { code: 'pbl', name: 'Pitch Black', cards: ['Murkrow', 'Poochyena', 'Sableye', 'Zubat', 'Houndour', 'Absol', 'Umbreon', 'Darkrai', 'Hydreigon'], hit: 'Mega Darkrai ex', hitValue: 34500 },
  'ascended-heroes': { code: 'asc', name: 'Ascended Heroes', cards: ['Riolu', 'Machop', 'Dratini', 'Ralts', 'Pawniard', 'Gible', 'Lucario', 'Gardevoir', 'Dragonite'], hit: 'Mega Dragonite ex', hitValue: 131900 },
  'phantasmal-flames': { code: 'pfl', name: 'Phantasmal Flames', cards: ['Litwick', 'Gastly', 'Vulpix', 'Houndour', 'Lampent', 'Ceruledge', 'Gengar', 'Chandelure', 'Armarouge'], hit: 'Mega Charizard ex', hitValue: 114200 },
  'time-of-battle': { code: 'op16', name: 'The Time of Battle', cards: ['Koby', 'Helmeppo', 'Tashigi', 'Smoker', 'Sentomaru', 'Kuzan', 'Borsalino', 'Sakazuki', 'Trafalgar Law'], hit: 'Monkey D. Luffy', hitValue: 144200 },
  'kamis-island': { code: 'op15', name: "Adventure on Kami's Island", cards: ['Nami', 'Usopp', 'Chopper', 'Robin', 'Franky', 'Brook', 'Sanji', 'Roronoa Zoro', 'Enel'], hit: 'Monkey D. Luffy', hitValue: 134300 },
  'carrying-on-his-will': { code: 'op13', name: 'Carrying on His Will', cards: ['Sabo', 'Koala', 'Ivankov', 'Dragon', 'Garp', 'Shanks', 'Portgas D. Ace', 'Monkey D. Luffy', 'Gol D. Roger'], hit: 'Gol D. Roger Manga Rare', hitValue: 3251900 },
};

const fixtureHex = (value: string): string => { let state = 2166136261; let result = ''; for (let block = 0; block < 8; block += 1) { for (let index = 0; index < value.length; index += 1) { state ^= value.charCodeAt(index) + block; state = Math.imul(state, 16777619); } result += (state >>> 0).toString(16).padStart(8, '0'); } return result; };
const fixtureCards = (expansionId: string): DemoCard[] => { const set = sets[expansionId]; if (!set) throw new Error('No demo outcome exists for this expansion.'); const cards = set.cards.map((name, index) => ({ id: `${set.code}-${String(index + 1).padStart(3, '0')}`, name, setName: set.name, rarity: index < 6 ? 'Common' as const : 'Rare' as const, marketValueCents: 80 + index * 95 })); return [...cards, { id: `${set.code}-hit`, name: set.hit, setName: set.name, rarity: 'Illustration Rare', marketValueCents: set.hitValue }]; };

export const createDemoPack = (expansionId: string): DemoPack => ({ id: `demo-${expansionId}`, expansionId, status: 'sealed', commitment: fixtureHex(`commitment:${expansionId}:demo-pack-v2`) });
export const openDemoPack = (pack: DemoPack): DemoPack => pack.status === 'revealed' ? pack : ({ ...pack, status: 'revealed', revealedCards: fixtureCards(pack.expansionId), verification: { commitment: pack.commitment, revealedSeed: fixtureHex(`seed:${pack.expansionId}:demo-pack-v2`), cardCount: 10, algorithmVersion: 'demo-pack-v2', previousChainFingerprint: fixtureHex('gemma-demo-chain-origin') } });
