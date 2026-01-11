import { atom } from 'jotai';

export type Session = {
  id: number;
  projectId: string;
  date: Date;
  duration: number;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export const sessionsAtom = atom<Session[]>([]);
