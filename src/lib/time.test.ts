import { formatDuration, formatElapsed, calculateElapsed } from './time';
describe('formatElapsed', () => {
  it ('formats zero seconds', () => {
    expect(formatElapsed(0)).toBe('00:00:00')
  })

  it('formats seconds only', () => {
    expect(formatElapsed(5)).toBe('00:00:05')
  })

  it('formats minutes and seconds', () => {
    expect(formatElapsed(65)).toBe('00:01:05')
  })

  it('formats hours, minutes seconds', () => {
    expect(formatElapsed(3661)).toBe('01:01:01')
  })
})

describe('formatDuration', () => {
  // formats minutes only
  it('formats minutes only', () => {
    expect(formatDuration(2700)).toBe('45m'); // 45*60
  })
  // formats hours only when no minutes
  it('formats hours only when no minutes', () => {
    expect(formatDuration(10800)).toBe('3h');
  })
  // formats hours and minutes
  it('formats hours and minutes', () => {
    expect(formatDuration(8100)).toBe('2h15m');
  })
  // handles zero
  it('handles zero', () => {
    expect(formatDuration(0)).toBe('0m')
  })
})


describe('calculateElapsed', () => {
  it('returns accumulated when lastResumed is null', () => {
    expect(calculateElapsed(100, null)).toBe(100);
  })

  it('adds time since resume', () => {
    const now = 1000000;
    const fiveSecondsAgo = now - 5000;

    jest.spyOn(Date, 'now').mockReturnValue(now);
    expect(calculateElapsed(100, fiveSecondsAgo)).toBe(105);
    jest.restoreAllMocks();
    // expect(calculateElapsed())
  })
})