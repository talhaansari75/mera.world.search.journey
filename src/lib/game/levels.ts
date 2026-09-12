import { hashString } from "@/lib/utils";
import type { LevelDef, PlaySession } from "./types";
import { CATEGORY_KEYS, CATEGORY_LABEL, WORLD_CATEGORIES, WORLD_META } from "./words";

export const CAMPAIGN_COUNT = 40;

export function campaignLevel(n: number): LevelDef {
  const i = Math.max(1, Math.min(CAMPAIGN_COUNT, n));
  const world = Math.ceil(i / 8);
  const index = ((i - 1) % 8) + 1;
  const boss = index === 8;
  const cats = WORLD_CATEGORIES[world - 1] ?? WORLD_CATEGORIES[0]!;
  const category = cats[(index - 1) % cats.length]!;
  const size = Math.min(12, 8 + Math.floor((world - 1) / 1) + (boss ? 1 : 0));
  const wordCount = 5 + world + (boss ? 2 : Math.floor((index - 1) / 3));
  const dirs = world === 1 ? (index <= 3 ? 3 : 4) : world === 2 ? 6 : 8;
  const difficulty =
    world <= 1 ? "easy" : world === 2 ? "medium" : world <= 4 ? "hard" : "expert";
  const timeLimit = boss ? 90 + world * 20 : world >= 4 ? 140 + world * 10 : undefined;
  return {
    id: `w${world}-${index}`,
    world,
    index,
    title: boss ? `${WORLD_META[world - 1]?.name} Titan` : `${WORLD_META[world - 1]?.name} ${index}`,
    size,
    wordCount: Math.min(14, wordCount),
    category,
    difficulty,
    dirs,
    boss,
    timeLimit,
  };
}

export function allCampaign(): LevelDef[] {
  return Array.from({ length: CAMPAIGN_COUNT }, (_, i) => campaignLevel(i + 1));
}

export function legendLevel(n: number): LevelDef {
  const size = Math.min(16, 10 + Math.floor(n / 12));
  const wordCount = Math.min(18, 8 + Math.floor(n / 8));
  const category = CATEGORY_KEYS[n % CATEGORY_KEYS.length]!;
  return {
    id: `legend-${n}`,
    world: 6,
    index: n,
    title: `Legend ${n}`,
    size,
    wordCount,
    category,
    difficulty: n > 20 ? "expert" : "hard",
    dirs: 8,
    timeLimit: n % 5 === 0 ? 120 : undefined,
  };
}

export function sessionFromLevel(level: LevelDef, mode: PlaySession["mode"] = "classic"): PlaySession {
  const seed = hashString(level.id + ":lexora");
  return {
    mode: level.timeLimit && mode === "classic" ? "timed" : mode,
    levelId: level.id,
    title: level.title,
    category: level.category,
    seed,
    size: level.size,
    wordCount: level.wordCount,
    dirs: level.dirs,
    timeLimit: mode === "zen" ? undefined : level.timeLimit,
    energyCost: mode === "zen" || mode === "daily" ? 0 : 1,
  };
}

export function dailySession(dateKey: string): PlaySession {
  const seed = hashString(`daily:${dateKey}`);
  const cat = CATEGORY_KEYS[seed % CATEGORY_KEYS.length]!;
  return {
    mode: "daily",
    levelId: `daily-${dateKey}`,
    title: "Daily folio",
    category: cat,
    seed,
    size: 10,
    wordCount: 8,
    dirs: 8,
    timeLimit: 150,
    energyCost: 0,
  };
}

export function endlessSession(wave: number): PlaySession {
  const seed = hashString(`endless:${wave}:${Date.now() % 100000}`);
  const cat = CATEGORY_KEYS[wave % CATEGORY_KEYS.length]!;
  const size = Math.min(14, 8 + Math.floor(wave / 3));
  return {
    mode: "endless",
    title: `Wave ${wave}`,
    category: cat,
    seed,
    size,
    wordCount: Math.min(16, 5 + wave),
    dirs: wave < 2 ? 4 : 8,
    energyCost: 0,
  };
}

export function modeSession(mode: PlaySession["mode"], extra?: Partial<PlaySession>): PlaySession {
  const cat = extra?.category ?? CATEGORY_KEYS[Math.floor(Math.random() * CATEGORY_KEYS.length)]!;
  const base: PlaySession = {
    mode,
    title:
      mode === "timed"
        ? "Time attack"
        : mode === "fog"
          ? "Fog bank"
          : mode === "rush"
            ? `${CATEGORY_LABEL[cat] ?? cat} rush`
            : mode === "zen"
              ? "Zen folio"
              : "Classic folio",
    category: cat,
    seed: (Math.random() * 0xffffffff) >>> 0,
    size: mode === "rush" ? 9 : mode === "fog" ? 10 : 9,
    wordCount: mode === "rush" ? 8 : 6,
    dirs: mode === "zen" ? 4 : 8,
    timeLimit: mode === "timed" || mode === "rush" ? 90 : mode === "fog" ? 120 : undefined,
    energyCost: mode === "zen" ? 0 : 1,
  };
  return { ...base, ...extra };
}

export function xpForLevel(playerXp: number) {
  let level = 1;
  let need = 80;
  let remain = playerXp;
  while (remain >= need && level < 99) {
    remain -= need;
    level += 1;
    need = Math.floor(80 * Math.pow(1.12, level - 1));
  }
  return { level, into: remain, need };
}

export function starsFor(result: { elapsed: number; hintsUsed: number; mistakes: number; timeLimit?: number }) {
  let s = 1;
  if (result.hintsUsed === 0) s += 1;
  if (result.mistakes === 0) s += 1;
  if (result.timeLimit && result.elapsed < result.timeLimit * 0.45) s = Math.max(s, 3);
  return Math.min(3, s);
}
