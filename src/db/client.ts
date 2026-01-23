import { drizzle } from 'drizzle-orm/expo-sqlite';
import { deleteDatabaseSync, openDatabaseSync } from 'expo-sqlite';

export const DATABASE_NAME = 'tempor.db';

export const expoDb = openDatabaseSync(DATABASE_NAME);
export const db = drizzle(expoDb);

/**
 * Delete the database file. For development use only.
 * The app must be restarted after calling this function.
 */
export function deleteDatabase(): void {
  expoDb.closeSync();
  deleteDatabaseSync(DATABASE_NAME);
  console.log(`Database "${DATABASE_NAME}" deleted. Please restart the app.`);
}
