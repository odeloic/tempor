import { expoDb } from './client';
import migrations from './migrations/migrations';

/**
 * Check if a table exists in the database.
 */
function tableExists(tableName: string): boolean {
  const result = expoDb.getFirstSync<{ name: string }>(
    `SELECT name FROM sqlite_master WHERE type='table' AND name=?`,
    [tableName]
  );
  return result !== null;
}

/**
 * Get the count of rows in the __drizzle_migrations table.
 */
function getMigrationCount(): number {
  try {
    const result = expoDb.getFirstSync<{ count: number }>(
      `SELECT COUNT(*) as count FROM __drizzle_migrations`
    );
    return result?.count ?? 0;
  } catch {
    // Table doesn't exist
    return 0;
  }
}

/**
 * Prepare migrations by checking if the database needs to be baselined.
 *
 * This handles the case where tables were created before the migration system
 * was set up (e.g., via drizzle-kit push during development). In this case,
 * we need to seed the __drizzle_migrations table with entries for all existing
 * migrations so that useMigrations() doesn't try to re-run them.
 *
 * This function is synchronous and should be called before useMigrations().
 */
export function prepareMigrations(): void {
  // Use 'projects' as sentinel table - if it exists, the schema was created
  const schemaExists = tableExists('projects');

  if (!schemaExists) {
    // Fresh database - migrations will create tables normally
    return;
  }

  // Schema exists - check if migrations are being tracked
  const migrationsTracked = getMigrationCount();

  if (migrationsTracked > 0) {
    // Already tracking migrations - nothing to do
    return;
  }

  // Schema exists but migrations aren't tracked - need to baseline

  // Create the migrations tracking table (same schema Drizzle uses)
  expoDb.execSync(`
    CREATE TABLE IF NOT EXISTS __drizzle_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      hash TEXT NOT NULL,
      created_at INTEGER
    )
  `);

  // Seed with entries from the migration journal
  const journal = migrations.journal;
  const entries = journal.entries;

  for (const entry of entries) {
    const hash = entry.tag;
    const createdAt = entry.when;

    expoDb.runSync(
      `INSERT INTO __drizzle_migrations (hash, created_at) VALUES (?, ?)`,
      [hash, createdAt]
    );
  }
}
