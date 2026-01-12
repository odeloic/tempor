import { useCallback, useEffect, useRef, useState } from 'react';
import { useAtom } from 'jotai';
import { db } from '@/db/client';
import { timerState, sessions, projects, type TimerState } from '@/db/schema';
import { timerStateAtom } from '@/atoms/timer';
import { eq } from 'drizzle-orm';
import { calculateElapsed } from '@/lib/time';

type TimerStatus = 'idle' | 'running' | 'paused';

export interface SavedSession {
  projectId: string;
  duration: number;
}

interface UseTimerReturn {
  status: TimerStatus;
  projectId: string | null;
  elapsed: number;
  start: (projectId: string) => Promise<SavedSession | null>;
  pause: () => Promise<void>;
  resume: () => Promise<void>;
  stop: () => Promise<void>;
  discard: () => Promise<void>;
}

export function useTimer(): UseTimerReturn {
  const [state, setState] = useAtom(timerStateAtom);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Load timer state from DB on mount
  useEffect(() => {
    const loadState = async () => {
      const [row] = await db.select().from(timerState).where(eq(timerState.id, 1));
      if (row) {
        setState(row);
      }
    };
    loadState();
  }, [setState]);

  // Update elapsed time every second when running
  useEffect(() => {
    if (state.status === 'running') {
      const updateElapsed = () => {
        const lastResumedMs = state.lastResumedAt?.getTime() ?? null;
        setElapsed(calculateElapsed(state.accumulatedSeconds, lastResumedMs));
      };

      updateElapsed();
      intervalRef.current = setInterval(updateElapsed, 1000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      setElapsed(state.accumulatedSeconds);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [state.status, state.accumulatedSeconds, state.lastResumedAt]);

  const persistState = useCallback(async (newState: Partial<TimerState>) => {
    await db.update(timerState).set(newState).where(eq(timerState.id, 1));
  }, []);

  const start = useCallback(async (projectId: string): Promise<SavedSession | null> => {
    let savedSession: SavedSession | null = null;

    // If timer is running or paused on another project, save that session first
    if (state.status !== 'idle' && state.projectId && state.projectId !== projectId) {
      const lastResumedMs = state.lastResumedAt?.getTime() ?? null;
      const finalElapsed = calculateElapsed(state.accumulatedSeconds, lastResumedMs);

      if (finalElapsed >= 60) {
        const now = new Date();
        await db.insert(sessions).values({
          projectId: state.projectId,
          date: now,
          duration: finalElapsed,
          note: null,
          createdAt: now,
          updatedAt: now,
        });
        savedSession = { projectId: state.projectId, duration: finalElapsed };
      }
    }

    const now = new Date();
    const newState: Partial<TimerState> = {
      projectId,
      status: 'running',
      accumulatedSeconds: 0,
      lastResumedAt: now,
    };

    await persistState(newState);
    setState(prev => ({ ...prev, ...newState } as TimerState));

    // Update lastUsedAt for the project being started
    await db.update(projects)
      .set({ lastUsedAt: now })
      .where(eq(projects.id, Number(projectId)));

    return savedSession;
  }, [state, setState, persistState]);

  const pause = useCallback(async () => {
    if (state.status !== 'running') return;

    const lastResumedMs = state.lastResumedAt?.getTime() ?? null;
    const currentElapsed = calculateElapsed(state.accumulatedSeconds, lastResumedMs);

    const newState: Partial<TimerState> = {
      status: 'paused',
      accumulatedSeconds: currentElapsed,
      lastResumedAt: null,
    };

    await persistState(newState);
    setState(prev => ({ ...prev, ...newState } as TimerState));
  }, [state, setState, persistState]);

  const resume = useCallback(async () => {
    if (state.status !== 'paused') return;

    const now = new Date();
    const newState: Partial<TimerState> = {
      status: 'running',
      lastResumedAt: now,
    };

    await persistState(newState);
    setState(prev => ({ ...prev, ...newState } as TimerState));
  }, [state, setState, persistState]);

  const stop = useCallback(async () => {
    if (state.status === 'idle') return;

    const lastResumedMs = state.lastResumedAt?.getTime() ?? null;
    const finalElapsed = calculateElapsed(state.accumulatedSeconds, lastResumedMs);

    // Save session if at least 1 minute tracked
    if (state.projectId && finalElapsed >= 60) {
      const now = new Date();
      await db.insert(sessions).values({
        projectId: state.projectId,
        date: now,
        duration: finalElapsed,
        note: null,
        createdAt: now,
        updatedAt: now,
      });
    }

    const newState: Partial<TimerState> = {
      projectId: null,
      status: 'idle',
      accumulatedSeconds: 0,
      lastResumedAt: null,
    };

    await persistState(newState);
    setState(prev => ({ ...prev, ...newState } as TimerState));
  }, [state, setState, persistState]);

  const discard = useCallback(async () => {
    const newState: Partial<TimerState> = {
      projectId: null,
      status: 'idle',
      accumulatedSeconds: 0,
      lastResumedAt: null,
    };

    await persistState(newState);
    setState(prev => ({ ...prev, ...newState } as TimerState));
  }, [setState, persistState]);

  return {
    status: state.status,
    projectId: state.projectId,
    elapsed,
    start,
    pause,
    resume,
    stop,
    discard,
  };
}
