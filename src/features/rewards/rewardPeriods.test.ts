import { rewardPeriods } from './rewardPeriods';

it('changes both periods at Italian Monday midnight in summer', () => {
  expect(rewardPeriods(new Date('2026-09-13T21:59:59Z'))).toEqual({ daily: '2026-09-13', weekly: '2026-09-07' });
  expect(rewardPeriods(new Date('2026-09-13T22:00:00Z'))).toEqual({ daily: '2026-09-14', weekly: '2026-09-14' });
});
it('uses winter Italian time across the year boundary', () => {
  expect(rewardPeriods(new Date('2026-12-31T23:00:00Z'))).toEqual({ daily: '2027-01-01', weekly: '2026-12-28' });
});
it('maps December 28 2023 to the Monday of that week', () => {
  expect(rewardPeriods(new Date('2023-12-28T12:00:00Z'))).toEqual({ daily: '2023-12-28', weekly: '2023-12-25' });
});
