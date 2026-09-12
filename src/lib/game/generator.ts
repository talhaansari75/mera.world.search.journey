import { pick, seededRng, shuffle } from "@/lib/utils";
import type { Cell, Placement, Puzzle } from "./types";
import { wordsForCategory } from "./words";

export const DIRS: Cell[] = [
  { r: 0, c: 1 },
  { r: 1, c: 0 },
  { r: 1, c: 1 },
  { r: 0, c: -1 },
  { r: -1, c: 0 },
  { r: -1, c: -1 },
  { r: 1, c: -1 },
  { r: -1, c: 1 },
];

const FILL = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

function fits(
  grid: (string | null)[][],
  word: string,
  r: number,
  c: number,
  dir: Cell,
): boolean {
  const n = grid.length;
  for (let i = 0; i < word.length; i++) {
    const rr = r + dir.r * i;
    const cc = c + dir.c * i;
    if (rr < 0 || cc < 0 || rr >= n || cc >= n) return false;
    const ch = grid[rr]![cc];
    if (ch && ch !== word[i]) return false;
  }
  return true;
}

function place(
  grid: (string | null)[][],
  word: string,
  r: number,
  c: number,
  dir: Cell,
): Cell[] {
  const cells: Cell[] = [];
  for (let i = 0; i < word.length; i++) {
    const rr = r + dir.r * i;
    const cc = c + dir.c * i;
    grid[rr]![cc] = word[i]!;
    cells.push({ r: rr, c: cc });
  }
  return cells;
}

export function generatePuzzle(opts: {
  size: number;
  wordCount: number;
  category: string;
  seed: number;
  dirs?: number;
  customWords?: string[];
}): Puzzle {
  const rand = seededRng(opts.seed);
  const size = Math.max(6, Math.min(16, opts.size));
  const dirCount = Math.max(3, Math.min(8, opts.dirs ?? 8));
  const dirs = DIRS.slice(0, dirCount);
  const pool = (opts.customWords?.length
    ? opts.customWords
    : wordsForCategory(opts.category)
  )
    .map((w) => w.toUpperCase().replace(/[^A-Z]/g, ""))
    .filter((w) => w.length >= 3 && w.length <= size);

  const unique = [...new Set(pool)];
  const ranked = shuffle(unique, rand).sort((a, b) => b.length - a.length);

  const grid: (string | null)[][] = Array.from({ length: size }, () =>
    Array.from({ length: size }, () => null),
  );
  const placements: Placement[] = [];
  const used = new Set<string>();

  for (const word of ranked) {
    if (placements.length >= opts.wordCount) break;
    if (used.has(word)) continue;
    let placed = false;
    for (let attempt = 0; attempt < 120 && !placed; attempt++) {
      const dir = dirs[Math.floor(rand() * dirs.length)]!;
      const r = Math.floor(rand() * size);
      const c = Math.floor(rand() * size);
      if (fits(grid, word, r, c, dir)) {
        const cells = place(grid, word, r, c, dir);
        placements.push({ word, cells });
        used.add(word);
        placed = true;
      }
    }
  }

  if (placements.length < Math.min(3, opts.wordCount) && opts.category !== "verbs") {
    return generatePuzzle({
      ...opts,
      seed: opts.seed + 97,
      category: "verbs",
      customWords: undefined,
    });
  }

  const lettersInPlay = placements.map((p) => p.word).join("") || FILL;
  const filled: string[][] = grid.map((row) =>
    row.map((ch) => {
      if (ch) return ch;
      if (rand() < 0.28) return pick(lettersInPlay.split(""), rand);
      return FILL[Math.floor(rand() * 26)]!;
    }),
  );

  return {
    size,
    grid: filled,
    placements,
    words: placements.map((p) => p.word),
    category: opts.category,
    seed: opts.seed,
  };
}

export function pathWord(grid: string[][], cells: Cell[]): string {
  return cells.map((c) => grid[c.r]?.[c.c] ?? "").join("");
}

export function cellsEqual(a: Cell, b: Cell) {
  return a.r === b.r && a.c === b.c;
}

export function isAdjacent(a: Cell, b: Cell) {
  return Math.max(Math.abs(a.r - b.r), Math.abs(a.c - b.c)) === 1 && !cellsEqual(a, b);
}

export function dirBetween(a: Cell, b: Cell): Cell {
  return {
    r: Math.sign(b.r - a.r),
    c: Math.sign(b.c - a.c),
  };
}

/** Build a collinear path from start through current, 8-direction only. */
export function linePath(start: Cell, end: Cell): Cell[] {
  const dr = end.r - start.r;
  const dc = end.c - start.c;
  if (dr === 0 && dc === 0) return [start];
  const stepR = Math.sign(dr);
  const stepC = Math.sign(dc);
  const lenR = Math.abs(dr);
  const lenC = Math.abs(dc);
  if (lenR !== 0 && lenC !== 0 && lenR !== lenC) return [start];
  const n = Math.max(lenR, lenC);
  const cells: Cell[] = [];
  for (let i = 0; i <= n; i++) {
    cells.push({ r: start.r + stepR * i, c: start.c + stepC * i });
  }
  return cells;
}

export function matchPlacement(
  placements: Placement[],
  cells: Cell[],
  remaining: Set<string>,
): Placement | null {
  if (cells.length < 3) return null;
  const key = cells.map((c) => `${c.r},${c.c}`).join(">");
  const rev = [...cells].reverse().map((c) => `${c.r},${c.c}`).join(">");
  for (const p of placements) {
    if (!remaining.has(p.word)) continue;
    const pk = p.cells.map((c) => `${c.r},${c.c}`).join(">");
    const pr = [...p.cells].reverse().map((c) => `${c.r},${c.c}`).join(">");
    if (pk === key || pr === key || pk === rev || pr === rev) return p;
  }
  return null;
}
