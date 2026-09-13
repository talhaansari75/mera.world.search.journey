import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { todayKey } from "@/lib/utils";
import { newlyUnlocked } from "./achievements";
import { detectLang } from "./i18n";
import { CAMPAIGN_COUNT, starsFor, xpForLevel } from "./levels";
import type {
  LangId,
  LevelRecord,
  LevelResult,
  Settings,
  Stats,
  ThemeId,
} from "./types";

const ENERGY_MAX = 20;
const ENERGY_MS = 5 * 60 * 1000;
const SAVE_VERSION = 2;

export const HINT_COST = { first: 10, letter: 20, word: 50 } as const;
export const AVATARS = ["L", "N", "S", "M", "A", "K", "R", "H"] as const;

const defaultSettings = (): Settings => ({
  lang: typeof navigator === "undefined" ? "en" : detectLang(),
  theme: "dark",
  master: 0.75,
  music: 0.2,
  sfx: 0.8,
  reduceMotion: false,
  screenShake: true,
  vibration: true,
  showDirections: true,
  largeText: false,
  colorBlind: false,
  highContrast: false,
  autoHint: false,
  confirmQuit: true,
});

const defaultStats = (): Stats => ({
  wordsFound: 0,
  levelsCompleted: 0,
  timePlayed: 0,
  hintsUsed: 0,
  mistakes: 0,
  longestStreak: 0,
  currentStreak: 0,
  coinsEarned: 0,
  coinsSpent: 0,
  perfects: 0,
  dailies: 0,
  bosses: 0,
  fogClears: 0,
  timedClears: 0,
  zenClears: 0,
  bestCombo: 0,
  fastestLevel: 0,
  spins: 0,
});

export interface GameSave {
  version: number;
  name: string;
  avatar: string;
  xp: number;
  coins: number;
  gems: number;
  energy: number;
  energyAt: number;
  campaignIndex: number;
  records: Record<string, LevelRecord>;
  achievements: Record<string, number>;
  noHintLevels: number;
  settings: Settings;
  stats: Stats;
  hintPacks: number;
  lastDailyClaim: string;
  lastDailyPlay: string;
  lastSpin: string;
  lastLogin: string;
  seenTutorial: boolean;
  ownedThemes: ThemeId[];
  wordLog: Record<string, number>;
  toast: string | null;
}

interface GameApi extends GameSave {
  hydrated: boolean;
  markHydrated: () => void;
  setName: (n: string) => void;
  setAvatar: (a: string) => void;
  patchSettings: (p: Partial<Settings>) => void;
  energyNow: () => number;
  spendEnergy: (n: number) => boolean;
  addCoins: (n: number) => void;
  spendCoins: (n: number) => boolean;
  spendGems: (n: number) => boolean;
  refillEnergy: (full: boolean) => boolean;
  applyResult: (r: LevelResult, extra?: { boss?: boolean; legend?: boolean }) => string[];
  buyHints: () => boolean;
  claimDaily: () => { coins: number; gems: number; day: number } | null;
  spin: () => { label: string; coins?: number; gems?: number; hints?: number } | null;
  logWord: (w: string) => void;
  setToast: (t: string | null) => void;
  importSave: (raw: string) => boolean;
  exportSave: () => string;
  resetAll: () => void;
}

function computeEnergy(energy: number, energyAt: number, now = Date.now()) {
  if (energy >= ENERGY_MAX) return { energy, energyAt };
  const gained = Math.floor((now - energyAt) / ENERGY_MS);
  if (gained <= 0) return { energy, energyAt };
  const next = Math.min(ENERGY_MAX, energy + gained);
  const used = next - energy;
  return { energy: next, energyAt: energyAt + used * ENERGY_MS };
}

const blank = (): GameSave => ({
  version: SAVE_VERSION,
  name: "Reader",
  avatar: "L",
  xp: 0,
  coins: 180,
  gems: 5,
  energy: ENERGY_MAX,
  energyAt: Date.now(),
  campaignIndex: 1,
  records: {},
  achievements: {},
  noHintLevels: 0,
  settings: defaultSettings(),
  stats: defaultStats(),
  hintPacks: 2,
  lastDailyClaim: "",
  lastDailyPlay: "",
  lastSpin: "",
  lastLogin: "",
  seenTutorial: false,
  ownedThemes: ["dark", "light"],
  wordLog: {},
  toast: null,
});

export const ENERGY_MAX_VALUE = ENERGY_MAX;
export const ENERGY_MS_VALUE = ENERGY_MS;

export const useGame = create<GameApi>()(
  persist(
    (set, get) => ({
      ...blank(),
      hydrated: false,
      markHydrated: () => set({ hydrated: true }),
      setName: (n) => set({ name: n.slice(0, 18) || "Reader" }),
      setAvatar: (a) => set({ avatar: a }),
      patchSettings: (p) => set({ settings: { ...get().settings, ...p } }),
      energyNow: () => {
        const e = computeEnergy(get().energy, get().energyAt);
        if (e.energy !== get().energy) set(e);
        return e.energy;
      },
      spendEnergy: (n) => {
        const e = computeEnergy(get().energy, get().energyAt);
        if (e.energy < n) {
          set(e);
          return false;
        }
        const next = e.energy - n;
        set({
          energy: next,
          energyAt: next >= ENERGY_MAX ? Date.now() : e.energy >= ENERGY_MAX ? Date.now() : e.energyAt,
        });
        return true;
      },
      addCoins: (n) =>
        set((s) => ({
          coins: s.coins + n,
          stats: n > 0 ? { ...s.stats, coinsEarned: s.stats.coinsEarned + n } : s.stats,
        })),
      spendCoins: (n) => {
        if (get().coins < n) return false;
        set((s) => ({
          coins: s.coins - n,
          stats: { ...s.stats, coinsSpent: s.stats.coinsSpent + n },
        }));
        return true;
      },
      spendGems: (n) => {
        if (get().gems < n) return false;
        set({ gems: get().gems - n });
        return true;
      },
      refillEnergy: (full) => {
        if (full) {
          if (!get().spendGems(8)) return false;
          set({ energy: ENERGY_MAX, energyAt: Date.now() });
          return true;
        }
        if (!get().spendCoins(40)) return false;
        const e = computeEnergy(get().energy, get().energyAt);
        set({ energy: Math.min(ENERGY_MAX, e.energy + 5), energyAt: Date.now() });
        return true;
      },
      applyResult: (r, extra) => {
        const s = get();
        const won = r.won;
        const rec = s.records[r.session.levelId ?? ""] ?? null;
        const stars = won ? starsFor({ ...r, timeLimit: r.session.timeLimit }) : 0;
        const records = { ...s.records };
        if (won && r.session.levelId) {
          records[r.session.levelId] = {
            stars: Math.max(rec?.stars ?? 0, stars),
            bestTime: rec ? Math.min(rec.bestTime, r.elapsed) : r.elapsed,
            hintsUsed: r.hintsUsed,
            completedAt: Date.now(),
          };
        }
        let campaignIndex = s.campaignIndex;
        if (won && r.session.levelId?.startsWith("w")) {
          const num = Number(r.session.levelId.replace(/\D+/g, "").slice(-0) || 0);
          void num;
          const match = /^w(\d+)-(\d+)$/.exec(r.session.levelId);
          if (match) {
            const abs = (Number(match[1]) - 1) * 8 + Number(match[2]);
            campaignIndex = Math.max(campaignIndex, Math.min(CAMPAIGN_COUNT, abs + 1));
          }
        }
        const stats: Stats = {
          ...s.stats,
          wordsFound: s.stats.wordsFound + r.found.length,
          levelsCompleted: s.stats.levelsCompleted + (won ? 1 : 0),
          timePlayed: s.stats.timePlayed + r.elapsed,
          hintsUsed: s.stats.hintsUsed + r.hintsUsed,
          mistakes: s.stats.mistakes + r.mistakes,
          coinsEarned: s.stats.coinsEarned + r.coins,
          perfects: s.stats.perfects + (r.perfect ? 1 : 0),
          dailies: s.stats.dailies + (r.session.mode === "daily" && won ? 1 : 0),
          bosses: s.stats.bosses + (extra?.boss && won ? 1 : 0),
          fogClears: s.stats.fogClears + (r.session.mode === "fog" && won ? 1 : 0),
          timedClears:
            s.stats.timedClears + ((r.session.mode === "timed" || r.session.timeLimit) && won ? 1 : 0),
          zenClears: s.stats.zenClears + (r.session.mode === "zen" && won ? 1 : 0),
          bestCombo: Math.max(s.stats.bestCombo, r.comboMax),
          fastestLevel:
            won && r.elapsed > 0
              ? s.stats.fastestLevel === 0
                ? r.elapsed
                : Math.min(s.stats.fastestLevel, r.elapsed)
              : s.stats.fastestLevel,
        };
        const noHintLevels = s.noHintLevels + (won && r.hintsUsed === 0 ? 1 : 0);
        const unlocked = newlyUnlocked(s.achievements, stats, {
          noHintLevels,
          fastClear: won && r.elapsed < 30,
          clutch: won && !!r.session.timeLimit && r.session.timeLimit - r.elapsed < 5,
          noMistakes: won && r.mistakes === 0,
          legend: !!extra?.legend,
        });
        const achievements = { ...s.achievements };
        for (const a of unlocked) achievements[a.id] = Date.now();
        const bonus = unlocked.reduce((n, a, i) => n + 40 + i * 10, 0);
        set({
          coins: s.coins + r.coins + bonus,
          xp: s.xp + r.xp,
          records,
          campaignIndex,
          stats,
          noHintLevels,
          achievements,
          lastDailyPlay: r.session.mode === "daily" && won ? todayKey() : s.lastDailyPlay,
          seenTutorial: true,
        });
        return unlocked.map((a) => a.title);
      },
      buyHints: () => {
        if (!get().spendCoins(80)) return false;
        set({ hintPacks: get().hintPacks + 3 });
        return true;
      },
      claimDaily: () => {
        const key = todayKey();
        const s = get();
        if (s.lastDailyClaim === key) return null;
        const yesterday = todayKey(new Date(Date.now() - 86400000));
        const streak =
          s.lastDailyClaim === yesterday ? Math.min(7, (s.stats.currentStreak || 0) + 1) : 1;
        const coins = 20 + streak * 8;
        const gems = streak === 7 ? 3 : streak === 3 ? 1 : 0;
        set({
          lastDailyClaim: key,
          lastLogin: key,
          coins: s.coins + coins,
          gems: s.gems + gems,
          stats: {
            ...s.stats,
            currentStreak: streak,
            longestStreak: Math.max(s.stats.longestStreak, streak),
            coinsEarned: s.stats.coinsEarned + coins,
          },
        });
        return { coins, gems, day: streak };
      },
      spin: () => {
        const key = todayKey();
        const s = get();
        const free = s.lastSpin !== key;
        if (!free && !get().spendCoins(60)) return null;
        const table = [
          { w: 30, label: "40 coins", coins: 40 },
          { w: 24, label: "80 coins", coins: 80 },
          { w: 16, label: "Hint pack", hints: 2 },
          { w: 12, label: "120 coins", coins: 120 },
          { w: 10, label: "1 gem", gems: 1 },
          { w: 5, label: "3 gems", gems: 3 },
          { w: 3, label: "Jackpot", coins: 400, gems: 2 },
        ];
        const total = table.reduce((n, x) => n + x.w, 0);
        let roll = Math.random() * total;
        let pick = table[0]!;
        for (const row of table) {
          roll -= row.w;
          if (roll <= 0) {
            pick = row;
            break;
          }
        }
        set({
          lastSpin: key,
          coins: get().coins + (pick.coins ?? 0),
          gems: get().gems + (pick.gems ?? 0),
          hintPacks: get().hintPacks + (pick.hints ?? 0),
          stats: {
            ...get().stats,
            spins: get().stats.spins + 1,
            coinsEarned: get().stats.coinsEarned + (pick.coins ?? 0),
          },
        });
        return pick;
      },
      logWord: (w) =>
        set((s) => ({ wordLog: { ...s.wordLog, [w]: (s.wordLog[w] ?? 0) + 1 } })),
      setToast: (t) => set({ toast: t }),
      exportSave: () => {
        const s = get();
        const blob: GameSave = {
          version: s.version,
          name: s.name,
          avatar: s.avatar,
          xp: s.xp,
          coins: s.coins,
          gems: s.gems,
          energy: s.energy,
          energyAt: s.energyAt,
          campaignIndex: s.campaignIndex,
          records: s.records,
          achievements: s.achievements,
          noHintLevels: s.noHintLevels,
          settings: s.settings,
          stats: s.stats,
          hintPacks: s.hintPacks,
          lastDailyClaim: s.lastDailyClaim,
          lastDailyPlay: s.lastDailyPlay,
          lastSpin: s.lastSpin,
          lastLogin: s.lastLogin,
          seenTutorial: s.seenTutorial,
          ownedThemes: s.ownedThemes,
          wordLog: s.wordLog,
          toast: null,
        };
        return JSON.stringify(blob);
      },
      importSave: (raw) => {
  try {
    const data = JSON.parse(raw) as Partial<GameSave>;

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      return false;
    }

    const isFiniteNumber = (value: unknown): value is number =>
      typeof value === "number" && Number.isFinite(value);

    if (
      !isFiniteNumber(data.xp) ||
      data.xp < 0 ||
      !isFiniteNumber(data.coins) ||
      data.coins < 0 ||
      !isFiniteNumber(data.gems) ||
      data.gems < 0 ||
      !isFiniteNumber(data.energy) ||
      data.energy < 0 ||
      data.energy > ENERGY_MAX ||
      !isFiniteNumber(data.energyAt) ||
      !isFiniteNumber(data.campaignIndex) ||
      data.campaignIndex < 1 ||
      data.campaignIndex > CAMPAIGN_COUNT ||
      !isFiniteNumber(data.hintPacks) ||
      data.hintPacks < 0
    ) {
      return false;
    }

    if (
      typeof data.name !== "string" ||
      typeof data.avatar !== "string" ||
      typeof data.seenTutorial !== "boolean"
    ) {
      return false;
    }

    const base = blank();

    set({
      ...base,
      ...data,
      settings: { ...base.settings, ...data.settings },
      stats: { ...base.stats, ...data.stats },
      version: SAVE_VERSION,
      toast: null,
      hydrated: true,
    });

    return true;
  } catch {
    return false;
  }
},
      resetAll: () => set({ ...blank(), hydrated: true, settings: get().settings }),
    }),
    {
      {
  name: "lexora-save-v1",
  version: SAVE_VERSION,

  migrate: (persistedState, version) => {
    const base = blank();

    if (!persistedState || typeof persistedState !== "object") {
      return base;
    }

    const data = persistedState as Partial<GameSave>;

    return {
      ...base,
      ...data,
      settings: { ...base.settings, ...data.settings },
      stats: { ...base.stats, ...data.stats },
      version: SAVE_VERSION,
      toast: null,
    };
  },

  storage: createJSONStorage(() => {
        if (typeof window === "undefined") {
          return {
            getItem: () => null,
            setItem: () => {},
            removeItem: () => {},
          };
        }
        return localStorage;
      }),
      skipHydration: true,
      partialize: (s) => ({
        version: s.version,
        name: s.name,
        avatar: s.avatar,
        xp: s.xp,
        coins: s.coins,
        gems: s.gems,
        energy: s.energy,
        energyAt: s.energyAt,
        campaignIndex: s.campaignIndex,
        records: s.records,
        achievements: s.achievements,
        noHintLevels: s.noHintLevels,
        settings: s.settings,
        stats: s.stats,
        hintPacks: s.hintPacks,
        lastDailyClaim: s.lastDailyClaim,
        lastDailyPlay: s.lastDailyPlay,
        lastSpin: s.lastSpin,
        lastLogin: s.lastLogin,
        seenTutorial: s.seenTutorial,
        ownedThemes: s.ownedThemes,
        wordLog: s.wordLog,
        toast: null,
      }),
    },
  ),
);

export function currentEnergy(energy: number, energyAt: number, now = Date.now()) {
  return computeEnergy(energy, energyAt, now).energy;
}
