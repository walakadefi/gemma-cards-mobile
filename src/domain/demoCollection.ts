import { expansions } from '../fixtures/catalog';

export type CardRarity = 'Common' | 'Rare' | 'Illustration Rare';
export interface DemoCard { id: string; name: string; setName: string; rarity: CardRarity; marketValueCents: number; }
export interface RevealVerification { commitment: string; revealedSeed: string; cardCount: 10; algorithmVersion: 'demo-pack-v2'; previousChainFingerprint: string; }
export interface DemoPack { id: string; expansionId: string; status: 'sealed' | 'revealed'; commitment: string; revealedCards?: DemoCard[]; verification?: RevealVerification; }

const sets: Record<string, { code: string; name: string; cards: string[]; hit: string; hitValue: number }> = {
  'pitch-black': { code: 'pbl', name: 'Pitch Black', cards: ['Murkrow', 'Poochyena', 'Sableye', 'Zubat', 'Houndour', 'Absol', 'Umbreon', 'Darkrai', 'Hydreigon'], hit: 'Mega Darkrai ex', hitValue: 34534 },
  'ascended-heroes': { code: 'asc', name: 'Ascended Heroes', cards: ['Riolu', 'Machop', 'Dratini', 'Ralts', 'Pawniard', 'Gible', 'Lucario', 'Gardevoir', 'Dragonite'], hit: 'Mega Dragonite ex', hitValue: 131884 },
  'phantasmal-flames': { code: 'pfl', name: 'Phantasmal Flames', cards: ['Litwick', 'Gastly', 'Vulpix', 'Houndour', 'Lampent', 'Ceruledge', 'Gengar', 'Chandelure', 'Armarouge'], hit: 'Mega Charizard ex', hitValue: 114202 },
  'time-of-battle': { code: 'op16', name: 'The Time of Battle', cards: ['Koby', 'Helmeppo', 'Tashigi', 'Smoker', 'Sentomaru', 'Kuzan', 'Borsalino', 'Sakazuki', 'Trafalgar Law'], hit: 'Monkey D. Luffy', hitValue: 144246 },
  'chaos-rising': { code: 'cri', name: 'Chaos Rising', cards: ['Chaos Rising 001', 'Chaos Rising 002', 'Chaos Rising 003', 'Chaos Rising 004', 'Chaos Rising 005', 'Chaos Rising 006', 'Chaos Rising 007', 'Chaos Rising 008', 'Chaos Rising 009'], hit: 'Chaos Rising demo hit', hitValue: 26138 },
  'kamis-island': { code: 'op15', name: "Adventure on Kami's Island", cards: ['Nami', 'Usopp', 'Chopper', 'Robin', 'Franky', 'Brook', 'Sanji', 'Roronoa Zoro', 'Enel'], hit: 'Monkey D. Luffy', hitValue: 134274 },
  'perfect-order': { code: 'por', name: 'Perfect Order', cards: ['Perfect Order 001', 'Perfect Order 002', 'Perfect Order 003', 'Perfect Order 004', 'Perfect Order 005', 'Perfect Order 006', 'Perfect Order 007', 'Perfect Order 008', 'Perfect Order 009'], hit: 'Perfect Order demo hit', hitValue: 14524 },
  'one-piece-heroines': { code: 'eb03', name: 'One Piece Heroines', cards: ['Nami', 'Nico Robin', 'Boa Hancock', 'Vivi', 'Perona', 'Reiju', 'Bonney', 'Shirahoshi', 'Uta'], hit: 'One Piece Heroines demo hit', hitValue: 244989 },
  'azure-seas-seven': { code: 'op14', name: "The Azure Sea's Seven", cards: ['Dracule Mihawk', 'Boa Hancock', 'Crocodile', 'Gecko Moria', 'Kuma', 'Doflamingo', 'Jinbe', 'Law', 'Buggy'], hit: "The Azure Sea's Seven demo hit", hitValue: 174719 },
  'carrying-on-his-will': { code: 'op13', name: 'Carrying on His Will', cards: ['Sabo', 'Koala', 'Ivankov', 'Dragon', 'Garp', 'Shanks', 'Portgas D. Ace', 'Monkey D. Luffy', 'Gol D. Roger'], hit: 'Gol D. Roger Manga Rare', hitValue: 3251886 },
};

const fixtureHex = (value: string): string => { let state = 2166136261; let result = ''; for (let block = 0; block < 8; block += 1) { for (let index = 0; index < value.length; index += 1) { state ^= value.charCodeAt(index) + block; state = Math.imul(state, 16777619); } result += (state >>> 0).toString(16).padStart(8, '0'); } return result; };
const fixtureCards = (expansionId: string, packId: string): DemoCard[] => {
  const expansion = expansions.find(({ id }) => id === expansionId);
  if (!expansion) throw new Error('No demo outcome exists for this expansion.');

  const set = sets[expansionId] ?? {
    code: expansion.code.toLowerCase(),
    name: expansion.name,
    cards: Array.from({ length: 9 }, (_, index) => `Prototype card ${String(index + 1).padStart(2, '0')}`),
    hit: 'Top set card preview',
    hitValue: expansion.topCardValueCents,
  };
  const cards = set.cards.map((name, index) => ({ id: `${packId}-${set.code}-${String(index + 1).padStart(3, '0')}`, name, setName: set.name, rarity: index < 6 ? 'Common' as const : 'Rare' as const, marketValueCents: 80 + index * 95 }));
  return [...cards, { id: `${packId}-${set.code}-hit`, name: set.hit, setName: set.name, rarity: 'Illustration Rare', marketValueCents: set.hitValue }];
};

export const createDemoPack = (expansionId: string, id = `demo-${expansionId}`): DemoPack => ({ id, expansionId, status: 'sealed', commitment: fixtureHex(`commitment:${expansionId}:demo-pack-v2`) });
export const openDemoPack = (pack: DemoPack): DemoPack => pack.status === 'revealed' ? pack : ({ ...pack, status: 'revealed', revealedCards: fixtureCards(pack.expansionId, pack.id), verification: { commitment: pack.commitment, revealedSeed: fixtureHex(`seed:${pack.expansionId}:demo-pack-v2`), cardCount: 10, algorithmVersion: 'demo-pack-v2', previousChainFingerprint: fixtureHex('gemma-demo-chain-origin') } });
