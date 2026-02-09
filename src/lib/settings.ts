import { db } from '@/db/client';
import { settings } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const ensureSettings = async () => {
    const rowExists = await db.select().from(settings).where(eq(settings.id, 1));
    if (rowExists.length === 0) {
        await db.insert(settings).values({
            id: 1,
        });
    }
};
