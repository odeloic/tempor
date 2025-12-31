import { type TimerState } from "@/db/schema";
import { atom } from 'jotai';


export const timerStateAtom = atom<TimerState>({
    id: 1,
    projectId: null,
    status: 'idle',
    accumulatedSeconds: 0,
    lastResumedAt: null
});

export const elapsedSecondAtom = atom(get => {
    const timer = get(timerStateAtom);
    if (timer.status === 'idle' || timer.status === 'paused') {
        return timer.accumulatedSeconds;
    }

    // Running = accumulated * updated_at
    const now = Date.now();
    const elapsed = timer.lastResumedAt
    ? Math.floor((now - timer.lastResumedAt.getTime()) / 1000)
    : 0;

    return timer.accumulatedSeconds + elapsed;
})