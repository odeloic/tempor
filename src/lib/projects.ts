import { type Project } from '@/db/schema';

/**
 * Sort projects by creation date (newest first).
 * This provides a stable order that doesn't change when projects are selected.
 */
export function sortProjectsByCreatedAt(projects: Project[]): Project[] {
  return [...projects].sort((a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime();
  });
}
