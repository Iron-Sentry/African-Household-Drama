import type { Story } from 'inkjs';

interface InkChoice {
  text: string;
}

export interface StoryMeta {
  knots: string[];
  moments: { id: string; title: string }[];
  tags: { tag: string; file: string; line: number }[];
}

export interface PlaythroughResult {
  story: Story;
  lines: string[];
  tags: string[];
  choicesMade: string[];
  stats: { approval: number; smarts: number; trouble: number };
  rank: string;
}

export const STORY_ENTRY: string;
export function compileInk(entry?: string): { json: string; warnings: string[]; files: string[]; meta: StoryMeta };
export function extractMeta(sources: Record<string, string>): StoryMeta;
export function playthrough(
  json: string,
  pick: (choices: InkChoice[], story: Story) => number,
  options?: { maxSteps?: number },
): PlaythroughResult;
export function rng(seed: number): () => number;
export function byText(...wanted: string[]): (choices: InkChoice[]) => number;
