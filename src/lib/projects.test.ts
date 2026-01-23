import { sortProjectsByRecentlyUsed } from './projects';
import { type Project } from '@/db/schema';

const createProject = (
  id: number,
  name: string,
  createdAt: Date,
  lastUsedAt: Date | null = null
): Project => ({
  id,
  name,
  client: null,
  color: '#E63946',
  createdAt,
  updatedAt: createdAt,
  lastUsedAt,
});

describe('sortProjectsByRecentlyUsed', () => {
  it('returns empty array for empty input', () => {
    expect(sortProjectsByRecentlyUsed([])).toEqual([]);
  });

  it('sorts projects with lastUsedAt by most recent first', () => {
    const older = createProject(1, 'Older', new Date('2024-01-01'), new Date('2024-01-10'));
    const newer = createProject(2, 'Newer', new Date('2024-01-01'), new Date('2024-01-15'));
    const newest = createProject(3, 'Newest', new Date('2024-01-01'), new Date('2024-01-20'));

    const result = sortProjectsByRecentlyUsed([older, newest, newer]);

    expect(result.map(p => p.name)).toEqual(['Newest', 'Newer', 'Older']);
  });

  it('places projects with lastUsedAt before those without', () => {
    const used = createProject(1, 'Used', new Date('2024-01-01'), new Date('2024-01-10'));
    const unused = createProject(2, 'Unused', new Date('2024-01-15'), null);

    const result = sortProjectsByRecentlyUsed([unused, used]);

    expect(result.map(p => p.name)).toEqual(['Used', 'Unused']);
  });

  it('sorts unused projects by creation date (newest first)', () => {
    const older = createProject(1, 'Older', new Date('2024-01-01'), null);
    const newer = createProject(2, 'Newer', new Date('2024-01-10'), null);
    const newest = createProject(3, 'Newest', new Date('2024-01-20'), null);

    const result = sortProjectsByRecentlyUsed([older, newest, newer]);

    expect(result.map(p => p.name)).toEqual(['Newest', 'Newer', 'Older']);
  });

  it('handles mixed used and unused projects correctly', () => {
    const usedOldest = createProject(1, 'UsedOldest', new Date('2024-01-01'), new Date('2024-01-05'));
    const usedNewest = createProject(2, 'UsedNewest', new Date('2024-01-01'), new Date('2024-01-20'));
    const unusedOld = createProject(3, 'UnusedOld', new Date('2024-01-01'), null);
    const unusedNew = createProject(4, 'UnusedNew', new Date('2024-01-15'), null);

    const result = sortProjectsByRecentlyUsed([
      unusedOld,
      usedOldest,
      unusedNew,
      usedNewest,
    ]);

    // Used projects first (by lastUsedAt), then unused (by createdAt)
    expect(result.map(p => p.name)).toEqual([
      'UsedNewest',
      'UsedOldest',
      'UnusedNew',
      'UnusedOld',
    ]);
  });

  it('does not mutate the original array', () => {
    const project1 = createProject(1, 'A', new Date('2024-01-10'), null);
    const project2 = createProject(2, 'B', new Date('2024-01-01'), null);
    const original = [project1, project2];
    const originalCopy = [...original];

    sortProjectsByRecentlyUsed(original);

    expect(original).toEqual(originalCopy);
  });
});
