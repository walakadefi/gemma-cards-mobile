import { expansionPresentation } from './expansionPresentation';

it('gives each expansion a stable visual identity', () => {
  expect(expansionPresentation('pitch-black')).toEqual({ accent: '#7C42F4', tint: '#211A35' });
  expect(expansionPresentation('time-of-battle')).toEqual({ accent: '#00B67A', tint: '#102A22' });
});
