import { expansions } from '../../fixtures/catalog';

const overrides: Record<string, { accent: string; tint: string }> = {
  'pitch-black': { accent: '#7C42F4', tint: '#211A35' },
  'time-of-battle': { accent: '#00B67A', tint: '#102A22' },
  'phantasmal-flames': { accent: '#E14A3B', tint: '#32191A' },
  'ascended-heroes': { accent: '#E6A93B', tint: '#332819' },
};

export const expansionPresentation = (expansionId: string): { accent: string; tint: string } => {
  const expansion = expansions.find((item) => item.id === expansionId);
  return overrides[expansionId] ?? { accent: expansion?.accent ?? '#7C42F4', tint: expansion?.game === 'onepiece' ? '#102A22' : '#211A35' };
};
