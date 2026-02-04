import { type Session } from '@/atoms/sessions';
import { aggregateSessionsByProjectAndDate } from '@/lib/sessions';

const createSession = (
  id: number,
  projectId: string,
  date: Date,
  duration: number,
  note: string | null = null
): Session => ({
  id,
  projectId,
  date,
  duration,
  note,
  createdAt: date,
  updatedAt: date,
});

describe('aggregateSessionsByProjectAndDate', () => {
  it('returns empty array for empty input', () => {
    expect(aggregateSessionsByProjectAndDate([])).toEqual([]);
  });

  it('returns single session unchanged as aggregated entry', () => {
    const session = createSession(1, '1', new Date(2024, 5, 15), 3600);
    const result = aggregateSessionsByProjectAndDate([session]);

    expect(result).toHaveLength(1);
    expect(result[0].projectId).toBe('1');
    expect(result[0].totalDuration).toBe(3600);
    expect(result[0].sessionCount).toBe(1);
    expect(result[0].sessions).toHaveLength(1);
  });

  it('aggregates multiple sessions for same project on same day', () => {
    const sessions: Session[] = [
      createSession(1, '1', new Date(2024, 5, 15, 9, 0), 1800, 'Morning'),
      createSession(2, '1', new Date(2024, 5, 15, 14, 0), 1800, 'Afternoon'),
      createSession(3, '1', new Date(2024, 5, 15, 16, 0), 1800, 'Evening'),
    ];

    const result = aggregateSessionsByProjectAndDate(sessions);

    expect(result).toHaveLength(1);
    expect(result[0].projectId).toBe('1');
    expect(result[0].totalDuration).toBe(5400); // 3 x 30 min = 90 min = 5400 sec
    expect(result[0].sessionCount).toBe(3);
    expect(result[0].sessions).toHaveLength(3);
  });

  it('keeps different projects on same day separate', () => {
    const sessions: Session[] = [
      createSession(1, '1', new Date(2024, 5, 15, 9, 0), 1800),
      createSession(2, '2', new Date(2024, 5, 15, 14, 0), 3600),
    ];

    const result = aggregateSessionsByProjectAndDate(sessions);

    expect(result).toHaveLength(2);
    const project1 = result.find((e) => e.projectId === '1');
    const project2 = result.find((e) => e.projectId === '2');

    expect(project1?.totalDuration).toBe(1800);
    expect(project1?.sessionCount).toBe(1);
    expect(project2?.totalDuration).toBe(3600);
    expect(project2?.sessionCount).toBe(1);
  });

  it('keeps same project on different days separate', () => {
    const sessions: Session[] = [
      createSession(1, '1', new Date(2024, 5, 15), 1800),
      createSession(2, '1', new Date(2024, 5, 16), 3600),
    ];

    const result = aggregateSessionsByProjectAndDate(sessions);

    expect(result).toHaveLength(2);
    expect(result[0].sessionCount).toBe(1);
    expect(result[1].sessionCount).toBe(1);
  });

  it('sorts sessions within aggregate by createdAt descending', () => {
    const earlier = new Date(2024, 5, 15, 9, 0);
    const later = new Date(2024, 5, 15, 17, 0);

    const sessions: Session[] = [
      createSession(1, '1', earlier, 1800),
      createSession(2, '1', later, 1800),
    ];

    const result = aggregateSessionsByProjectAndDate(sessions);

    expect(result[0].sessions[0].id).toBe(2); // Later session first
    expect(result[0].sessions[1].id).toBe(1);
  });
});
