import { strings } from '@/constants/strings';
import { startOfDay, subDays } from 'date-fns';
import { formatDateLabel, getDateKey } from './date';
describe('formatDateLabel', () => {
  it('returns `Today` for todays timestamp', () => {
    expect(formatDateLabel(Date.now())).toBe(strings.today)
  });

  it('returns `Yesterday for yesterdays timestamp', () => {
    const yesterday = subDays(new Date(), 1).getTime();
    expect(formatDateLabel(yesterday)).toBe(strings.yesterday);
  })

  it('returns formatted date for older dates', () => {
    expect(formatDateLabel(startOfDay(new Date(2023,11,23)).getTime())).toBe('Dec 23')
  })
})


describe('getDateKey', () => {
  it('returns YYYY-MM-DD', () => {
    expect(getDateKey(new Date(2024,11,2).getTime())).toBe('2024-12-02');
  })

  it('Groups same-day timestamps together', () => {
    const morning = new Date(2024, 5, 15, 9, 0, 0).getTime();
    const evening = new Date(2024, 5, 15, 21, 30, 0).getTime();

    expect(getDateKey(morning)).toBe(getDateKey(evening));
  })
})