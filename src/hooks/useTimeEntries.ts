import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { db } from '@/db/client';
import { sessions } from '@/db/schema';
import { sessionsAtom, Session } from '@/atoms/sessions';
import { desc, eq } from 'drizzle-orm';
import { startOfDay, endOfDay } from 'date-fns';

export type DateRange = {
  start: Date;
  end: Date;
};

export type TimeEntriesFilter = {
  projectIds?: number[];
  dateRange?: DateRange;
};

interface CreateEntryData {
  projectId: string;
  date: Date;
  duration: number;
  note?: string | null;
}

interface UpdateEntryData {
  projectId?: string;
  date?: Date;
  duration?: number;
  note?: string | null;
}

export function useTimeEntries(filter?: TimeEntriesFilter) {
  const [sessionList, setSessionList] = useAtom(sessionsAtom);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await db
        .select()
        .from(sessions)
        .orderBy(desc(sessions.date), desc(sessions.createdAt));
      setSessionList(result);
    } catch {
      // Session fetch failed silently
    } finally {
      setIsLoading(false);
    }
  }, [setSessionList]);

  useEffect(() => {
    if (sessionList.length === 0) {
      refresh();
    }
  }, [sessionList.length, refresh]);

  const filteredEntries = useMemo(() => {
    let entries = [...sessionList];

    if (filter?.projectIds && filter.projectIds.length > 0) {
      const projectIdStrings = filter.projectIds.map(String);
      entries = entries.filter((e) => projectIdStrings.includes(e.projectId));
    }

    if (filter?.dateRange) {
      const start = startOfDay(filter.dateRange.start).getTime();
      const end = endOfDay(filter.dateRange.end).getTime();
      entries = entries.filter((e) => {
        const entryTime = e.date.getTime();
        return entryTime >= start && entryTime <= end;
      });
    }

    return entries;
  }, [sessionList, filter?.projectIds, filter?.dateRange]);

  const totalDuration = useMemo(() => {
    return filteredEntries.reduce((sum, e) => sum + e.duration, 0);
  }, [filteredEntries]);

  const create = useCallback(
    async (data: CreateEntryData): Promise<Session> => {
      const now = new Date();
      const [created] = await db
        .insert(sessions)
        .values({
          projectId: data.projectId,
          date: data.date,
          duration: data.duration,
          note: data.note ?? null,
          createdAt: now,
          updatedAt: now,
        })
        .returning();

      setSessionList((prev) => [created, ...prev]);
      return created;
    },
    [setSessionList]
  );

  const update = useCallback(
    async (id: number, data: UpdateEntryData): Promise<void> => {
      const now = new Date();
      await db
        .update(sessions)
        .set({
          ...data,
          updatedAt: now,
        })
        .where(eq(sessions.id, id));

      setSessionList((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...data, updatedAt: now } : s))
      );
    },
    [setSessionList]
  );

  const remove = useCallback(
    async (id: number): Promise<void> => {
      await db.delete(sessions).where(eq(sessions.id, id));
      setSessionList((prev) => prev.filter((s) => s.id !== id));
    },
    [setSessionList]
  );

  const getEntry = useCallback(
    (id: number): Session | undefined => {
      return sessionList.find((s) => s.id === id);
    },
    [sessionList]
  );

  return {
    entries: filteredEntries,
    allEntries: sessionList,
    isLoading,
    totalDuration,
    create,
    update,
    remove,
    getEntry,
    refresh,
  };
}
