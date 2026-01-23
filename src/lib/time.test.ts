import { formatDuration, formatElapsed, calculateElapsed, hoursMinutesToSeconds } from './time';
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

describe('hoursMinutesToSeconds', () => {
  it('converts 7 hours to 25200 seconds', () => {
    expect(hoursMinutesToSeconds(7, 0)).toBe(25200);
  });

  it('converts 2 hours 30 minutes to 9000 seconds', () => {
    expect(hoursMinutesToSeconds(2, 30)).toBe(9000);
  });

  it('converts 0 hours 45 minutes to 2700 seconds', () => {
    expect(hoursMinutesToSeconds(0, 45)).toBe(2700);
  });

  it('converts 0 hours 0 minutes to 0 seconds', () => {
    expect(hoursMinutesToSeconds(0, 0)).toBe(0);
  });

  it('converts 1 hour 1 minute to 3660 seconds', () => {
    expect(hoursMinutesToSeconds(1, 1)).toBe(3660);
  });
});

/**
 * Integration tests: hoursMinutesToSeconds + formatDuration
 * These verify that manual entries display correctly when using the conversion function
 */
describe('manual entry with hoursMinutesToSeconds displays correctly', () => {
  it('7 hours displays as 7h', () => {
    const duration = hoursMinutesToSeconds(7, 0);
    expect(formatDuration(duration)).toBe('7h');
  });

  it('2 hours 30 minutes displays as 2h30m', () => {
    const duration = hoursMinutesToSeconds(2, 30);
    expect(formatDuration(duration)).toBe('2h30m');
  });

  it('45 minutes displays as 45m', () => {
    const duration = hoursMinutesToSeconds(0, 45);
    expect(formatDuration(duration)).toBe('45m');
  });

  it('1 hour 15 minutes displays as 1h15m', () => {
    const duration = hoursMinutesToSeconds(1, 15);
    expect(formatDuration(duration)).toBe('1h15m');
  });
});