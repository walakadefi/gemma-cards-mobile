import { CardRarity } from '../../domain/demoCollection';

export const rarityPresentation = (rarity: CardRarity): { borderColor: string; textColor: string; badgeBackground: string; label: string } => {
  if (rarity === 'Illustration Rare') return { borderColor: '#F3D273', textColor: '#F3D273', badgeBackground: '#332A17', label: 'CHASE' };
  if (rarity === 'Rare') return { borderColor: '#7C42F4', textColor: '#C796FF', badgeBackground: '#211A35', label: 'RARE' };
  return { borderColor: '#53515A', textColor: '#B7B4BE', badgeBackground: '#1D1C20', label: 'COMMON' };
};
