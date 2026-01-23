export const formatElapsed = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  return [h,m,s].map(n => n.toString().padStart(2,'0')).join(':')
}

export const formatDuration = (seconds: number): string => {
  const totalMinutes = Math.floor(seconds / 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;

  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;

  return `${h}h${m}m` // 2h30m
}

export const calculateElapsed = (accumulated: number, lastResumed: number | null): number => {
  if (lastResumed === null) return accumulated;
  return accumulated + Math.floor((Date.now() - lastResumed) / 1000);
}

/**
 * Converts hours and minutes to total seconds.
 * Use this for all manual time entry to ensure consistent units.
 */
export const hoursMinutesToSeconds = (hours: number, minutes: number): number => {
  return hours * 3600 + minutes * 60;
}