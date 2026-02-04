import { sortProjectsByCreatedAt } from '@/lib/projects';
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

describe('sortProjectsByCreatedAt', () => {
  it('returns empty array for empty input', () => {
    expect(sortProjectsByCreatedAt([])).toEqual([]);
  });

  it('sorts projects by creation date (newest first)', () => {
    const older = createProject(1, 'Older', new Date('2024-01-01'), null);
    const newer = createProject(2, 'Newer', new Date('2024-01-10'), null);
    const newest = createProject(3, 'Newest', new Date('2024-01-20'), null);

    const result = sortProjectsByCreatedAt([older, newest, newer]);

    expect(result.map(p => p.name)).toEqual(['Newest', 'Newer', 'Older']);
  });

  it('ignores lastUsedAt and only sorts by createdAt', () => {
    const usedRecently = createProject(1, 'UsedRecently', new Date('2024-01-01'), new Date('2024-01-20'));
    const usedLongAgo = createProject(2, 'UsedLongAgo', new Date('2024-01-15'), new Date('2024-01-05'));
    const neverUsed = createProject(3, 'NeverUsed', new Date('2024-01-10'), null);

    const result = sortProjectsByCreatedAt([usedRecently, usedLongAgo, neverUsed]);

    // Should sort by createdAt only, ignoring lastUsedAt
    expect(result.map(p => p.name)).toEqual(['UsedLongAgo', 'NeverUsed', 'UsedRecently']);
  });

  it('does not mutate the original array', () => {
    const project1 = createProject(1, 'A', new Date('2024-01-10'), null);
    const project2 = createProject(2, 'B', new Date('2024-01-01'), null);
    const original = [project1, project2];
    const originalCopy = [...original];

    sortProjectsByCreatedAt(original);

    expect(original).toEqual(originalCopy);
  });
});
