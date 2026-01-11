import { Project } from "@/db/schema";
import { atom } from "jotai";

export const projectFilterAtom = atom<Project['id'][]>([]);

export const dateRangeFilterAtom = atom<{ start: Date; end: Date } | null>(null);