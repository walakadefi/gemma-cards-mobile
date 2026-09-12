import { rarityPresentation } from './rarityPresentation';

it.each([
  ['Common', '#53515A'],
  ['Rare', '#7C42F4'],
  ['Illustration Rare', '#F3D273'],
] as const)('gives %s cards a distinct collector treatment', (rarity, borderColor) => {
  expect(rarityPresentation(rarity).borderColor).toBe(borderColor);
});
