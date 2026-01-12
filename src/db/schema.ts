import { DB_TABLES } from '@/constants/db';
import { sql } from 'drizzle-orm';
import { check, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const projects = sqliteTable(DB_TABLES.PROJECTS, {
    id: integer().primaryKey(),
    name: text('name').notNull(),
    color: text('color').notNull(),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
    lastUsedAt: integer('last_used_at', { mode: 'timestamp' }),
});

export const sessions = sqliteTable(DB_TABLES.SESSIONS, {
    id: integer().primaryKey(),
    projectId: text('project_id').notNull().references(() => projects.id),
    date: integer('date', { mode: 'timestamp' }).notNull(),
    duration: integer('duration').notNull(),
    note: text('note'),
    createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
    updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
});

export const timerState = sqliteTable(DB_TABLES.TIMER_STATE,
    {
        id: integer().primaryKey(),
        projectId: text('project_id').references(() => projects.id),
        status: text('status', { enum: ['idle', 'running', 'paused'] }).notNull().default('idle'),
        accumulatedSeconds: integer('accumulated_seconds').notNull().default(0),
        lastResumedAt: integer('last_resumed_at', { mode: 'timestamp_ms' }),
    },
    (table) => [
        check('timer_state_singleton_check', sql`${table.id} = 1`)
    ]
);

export type TimerState = typeof timerState.$inferSelect;
export type Project = typeof projects.$inferSelect;