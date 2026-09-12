import { bestPullShareMessage } from './profileShare';

it('makes a concise share message for a best pull', () => {
  expect(bestPullShareMessage('Mega Darkrai ex', 'Pitch Black')).toBe('I just pulled Mega Darkrai ex from Pitch Black on GemmaCards.');
});
