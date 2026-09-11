export function rewardPeriods(now: Date) {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'Europe/Rome', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const part = (type: string) => parts.find((entry) => entry.type === type)!.value;
  const daily = `${part('year')}-${part('month')}-${part('day')}`;
  const monday = new Date(`${daily}T12:00:00Z`);
  monday.setUTCDate(monday.getUTCDate() - (monday.getUTCDay() + 6) % 7);
  return { daily, weekly: monday.toISOString().slice(0, 10) };
}
