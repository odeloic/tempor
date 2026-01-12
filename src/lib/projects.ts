import { type Project } from '@/db/schema';

/**
 * Sort projects by recently used first, then by creation date.
 * Projects with lastUsedAt come first, sorted by most recent.
 * Projects without lastUsedAt are sorted by creation date (newest first).
 */
export function sortProjectsByRecentlyUsed(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    // Projects with lastUsedAt come first, sorted by most recent
    if (a.lastUsedAt && b.lastUsedAt) {
      return b.lastUsedAt.getTime() - a.lastUsedAt.getTime();
    }
    if (a.lastUsedAt && !b.lastUsedAt) return -1;
    if (!a.lastUsedAt && b.lastUsedAt) return 1;
    // Fall back to creation date for projects never used
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}
