import { atom } from 'jotai';
import type { Project } from '@/db/schema';

export const projectsAtom = atom<Project[]>([]);
