import { Expansion } from '../domain/catalog';

const artwork = (code: string) => `https://www.gemma.cards/cards/packs/${code.toLowerCase()}.webp`;

export const expansions: Expansion[] = [
  { id: 'pitch-black', game: 'pokemon', name: 'Pitch Black', code: 'PBL', coinPrice: 500, topCardValueCents: 34534, accent: '#8B5CF6', description: 'The newest dark-themed Pokémon expansion on Gemma.', imageUri: artwork('PBL') },
  { id: 'time-of-battle', game: 'onepiece', name: 'The Time of Battle', code: 'OP16', coinPrice: 500, topCardValueCents: 144246, accent: '#F5C451', description: 'Leaders, alternate art, and manga rares from the newest One Piece expansion.', imageUri: artwork('OP16') },
  { id: 'chaos-rising', game: 'pokemon', name: 'Chaos Rising', code: 'CRI', coinPrice: 500, topCardValueCents: 26138, accent: '#EF4444', description: 'A current Pokémon expansion from the Gemma pack shelf.', imageUri: artwork('CRI') },
  { id: 'kamis-island', game: 'onepiece', name: "Adventure on Kami's Island", code: 'OP15', coinPrice: 500, topCardValueCents: 134274, accent: '#43B8FF', description: 'A current One Piece expansion from the Gemma pack shelf.', imageUri: artwork('OP15') },
  { id: 'perfect-order', game: 'pokemon', name: 'Perfect Order', code: 'POR', coinPrice: 500, topCardValueCents: 14524, accent: '#22C55E', description: 'A current Pokémon expansion from the Gemma pack shelf.', imageUri: artwork('POR') },
  { id: 'one-piece-heroines', game: 'onepiece', name: 'One Piece Heroines', code: 'EB03', coinPrice: 1000, topCardValueCents: 244989, accent: '#EC4899', description: 'A One Piece extra booster focused on the series heroines.', imageUri: artwork('EB03') },
  { id: 'ascended-heroes', game: 'pokemon', name: 'Ascended Heroes', code: 'ASC', coinPrice: 500, topCardValueCents: 131884, accent: '#00B67A', description: 'A current Pokémon expansion with one of Gemma’s highest-value chase cards.', imageUri: artwork('ASC') },
  { id: 'azure-seas-seven', game: 'onepiece', name: "The Azure Sea's Seven", code: 'OP14', coinPrice: 500, topCardValueCents: 174719, accent: '#0EA5E9', description: 'A current One Piece expansion from the Gemma pack shelf.', imageUri: artwork('OP14') },
];
