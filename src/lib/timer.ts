import { db } from "@/db/client";
import { timerState } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Look up in timer_state singleton db
 * Inserts a row in timer_state ingleton db if it doesn't exists
 *
 */
export const ensureTimerState = async () => {
    const rowExists = await db.select().from(timerState).where(eq(timerState.id, 1));
    if (rowExists.length === 0) {
        await db.insert(timerState).values({
            id: 1
        });
    }
}

export const initializeTimer = async (cb: () => void) => {
    await ensureTimerState();
    cb();
}