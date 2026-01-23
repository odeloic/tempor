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

/**
 * Tests for manual entry duration calculation
 *
 * This simulates how add.tsx calculates duration:
 *   const duration = hours * 60 + minutes;
 *
 * The duration is stored in the database and later displayed using formatDuration()
 */
describe('manual entry duration calculation', () => {
  // Helper to simulate what add.tsx does
  const calculateManualEntryDuration = (hours: number, minutes: number): number => {
    return hours * 60 + minutes;
  };

  it('calculates duration for 7 hours as 420 (minutes)', () => {
    const duration = calculateManualEntryDuration(7, 0);
    expect(duration).toBe(420);
  });

  it('calculates duration for 2 hours 30 minutes as 150 (minutes)', () => {
    const duration = calculateManualEntryDuration(2, 30);
    expect(duration).toBe(150);
  });

  it('calculates duration for 0 hours 45 minutes as 45 (minutes)', () => {
    const duration = calculateManualEntryDuration(0, 45);
    expect(duration).toBe(45);
  });

  /**
   * BUG: This test documents the current buggy behavior
   * When user enters 7 hours, the duration is stored as 420 (minutes)
   * But formatDuration expects SECONDS, so it interprets 420 as 420 seconds = 7 minutes
   */
  describe('formatDuration with manual entry values (BUG DEMONSTRATION)', () => {
    it('BUG: 7 hours entered displays as 7m instead of 7h', () => {
      const userEnteredHours = 7;
      const userEnteredMinutes = 0;
      const storedDuration = calculateManualEntryDuration(userEnteredHours, userEnteredMinutes);

      // This is what actually happens (buggy)
      const actualDisplay = formatDuration(storedDuration);
      expect(actualDisplay).toBe('7m'); // BUG: shows 7 minutes instead of 7 hours

      // What should happen (correct behavior):
      // formatDuration should receive seconds, not minutes
      // 7 hours = 7 * 3600 = 25200 seconds
      const correctSecondsValue = userEnteredHours * 3600 + userEnteredMinutes * 60;
      const correctDisplay = formatDuration(correctSecondsValue);
      expect(correctDisplay).toBe('7h'); // This is what user expects to see
    });

    it('BUG: 2h 30m entered displays as 2m instead of 2h30m', () => {
      const userEnteredHours = 2;
      const userEnteredMinutes = 30;
      const storedDuration = calculateManualEntryDuration(userEnteredHours, userEnteredMinutes);

      // This is what actually happens (buggy)
      const actualDisplay = formatDuration(storedDuration);
      expect(actualDisplay).toBe('2m'); // BUG: shows 2 minutes instead of 2h30m

      // What should happen (correct behavior):
      const correctSecondsValue = userEnteredHours * 3600 + userEnteredMinutes * 60;
      const correctDisplay = formatDuration(correctSecondsValue);
      expect(correctDisplay).toBe('2h30m'); // This is what user expects to see
    });

    it('BUG: 45 minutes entered displays as 0m instead of 45m', () => {
      const userEnteredHours = 0;
      const userEnteredMinutes = 45;
      const storedDuration = calculateManualEntryDuration(userEnteredHours, userEnteredMinutes);

      // This is what actually happens (buggy)
      const actualDisplay = formatDuration(storedDuration);
      expect(actualDisplay).toBe('0m'); // BUG: shows 0 minutes instead of 45m

      // What should happen (correct behavior):
      const correctSecondsValue = userEnteredHours * 3600 + userEnteredMinutes * 60;
      const correctDisplay = formatDuration(correctSecondsValue);
      expect(correctDisplay).toBe('45m'); // This is what user expects to see
    });
  });
});