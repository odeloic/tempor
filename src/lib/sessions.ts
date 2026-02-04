import { type Session } from '@/atoms/sessions';
import { getDateKey } from '@/lib/date';

export type AggregatedEntry = {
  projectId: string;
  dateKey: string;
  date: Date;
  totalDuration: number;
  sessionCount: number;
  sessions: Session[];
};

/**
 * Aggregates sessions by project and date.
 * Sessions for the same project on the same day are grouped together.
 */
export function aggregateSessionsByProjectAndDate(sessions: Session[]): AggregatedEntry[] {
  const aggregationMap = new Map<string, AggregatedEntry>();

  for (const session of sessions) {
    const dateKey = getDateKey(session.date.getTime());
    const key = `${session.projectId}-${dateKey}`;

    const existing = aggregationMap.get(key);
    if (existing) {
      existing.totalDuration += session.duration;
      existing.sessionCount += 1;
      existing.sessions.push(session);
    } else {
      aggregationMap.set(key, {
        projectId: session.projectId,
        dateKey,
        date: session.date,
        totalDuration: session.duration,
        sessionCount: 1,
        sessions: [session],
      });
    }
  }

  // Sort sessions within each aggregate by createdAt descending
  for (const entry of aggregationMap.values()) {
    entry.sessions.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  return Array.from(aggregationMap.values());
}
