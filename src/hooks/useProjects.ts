import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAtom } from 'jotai';
import { db } from '@/db/client';
import { projects, sessions, Project } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { projectColors } from '@/constants/colors';
import { projectsAtom } from '@/atoms/projects';
import { sortProjectsByCreatedAt } from '@/lib/projects';

interface CreateProjectData {
  name: string;
  client?: string | null;
  color: string;
}

interface UpdateProjectData {
  name?: string;
  client?: string | null;
  color?: string;
}

export function useProjects() {
  const [projectList, setProjectList] = useAtom(projectsAtom);
  const [isLoading, setIsLoading] = useState(false);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    try {
      const result = await db.select().from(projects);
      setProjectList(result);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setIsLoading(false);
    }
  }, [setProjectList]);

  // Sort projects by creation date (newest first) for stable ordering
  const sortedProjects = useMemo(() => {
    return sortProjectsByCreatedAt(projectList);
  }, [projectList]);

  // Fetch on mount if atom is empty
  useEffect(() => {
    if (projectList.length === 0) {
      refresh();
    }
  }, [projectList.length, refresh]);

  const createProject = useCallback(async (data: CreateProjectData): Promise<Project> => {
    const now = new Date();
    const [created] = await db.insert(projects).values({
      name: data.name,
      client: data.client ?? null,
      color: data.color,
      createdAt: now,
      updatedAt: now,
    }).returning();

    setProjectList(prev => [...prev, created]);
    return created;
  }, [setProjectList]);

  const updateProject = useCallback(async (id: number, data: UpdateProjectData): Promise<void> => {
    const now = new Date();
    await db.update(projects)
      .set({
        ...data,
        updatedAt: now,
      })
      .where(eq(projects.id, id));

    setProjectList(prev =>
      prev.map(p => p.id === id ? { ...p, ...data, updatedAt: now } : p)
    );
  }, [setProjectList]);

  const deleteProject = useCallback(async (id: number): Promise<void> => {
    // First delete associated sessions
    await db.delete(sessions).where(eq(sessions.projectId, String(id)));
    // Then delete the project
    await db.delete(projects).where(eq(projects.id, id));

    setProjectList(prev => prev.filter(p => p.id !== id));
  }, [setProjectList]);

  const hasTimeEntries = useCallback(async (id: number): Promise<boolean> => {
    const result = await db.select().from(sessions).where(eq(sessions.projectId, String(id)));
    return result.length > 0;
  }, []);

  const getProject = useCallback((id: number): Project | undefined => {
    return projectList.find(p => p.id === id);
  }, [projectList]);

  return {
    projects: sortedProjects,
    isLoading,
    createProject,
    updateProject,
    deleteProject,
    hasTimeEntries,
    getProject,
    refresh,
    defaultColor: projectColors[0],
  };
}