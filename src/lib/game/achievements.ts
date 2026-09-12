import type { Stats } from "./types";

export interface AchievementDef {
  id: string;
  title: string;
  detail: string;
  test: (s: Stats, extra?: Record<string, number | boolean>) => boolean;
}

export const ACHIEVEMENTS: AchievementDef[] = [
  { id: "first_word", title: "First ink", detail: "Find a word.", test: (s) => s.wordsFound >= 1 },
  { id: "words_100", title: "Hundred names", detail: "Find 100 words.", test: (s) => s.wordsFound >= 100 },
  { id: "words_500", title: "Lexicon hand", detail: "Find 500 words.", test: (s) => s.wordsFound >= 500 },
  { id: "levels_10", title: "Ten folios", detail: "Complete 10 levels.", test: (s) => s.levelsCompleted >= 10 },
  { id: "levels_40", title: "World walker", detail: "Finish the five worlds.", test: (s) => s.levelsCompleted >= 40 },
  { id: "no_hint_10", title: "Unaided", detail: "Clear 10 levels without hints.", test: (_s, e) => Number(e?.noHintLevels ?? 0) >= 10 },
  { id: "speed", title: "Swift hand", detail: "Finish a folio under 30 seconds.", test: (_s, e) => !!e?.fastClear },
  { id: "perfect_5", title: "Clean copy", detail: "Five perfect folios.", test: (s) => s.perfects >= 5 },
  { id: "daily_7", title: "Week at the desk", detail: "Seven-day streak.", test: (s) => s.longestStreak >= 7 },
  { id: "coins_5k", title: "Full purse", detail: "Earn 5,000 coins.", test: (s) => s.coinsEarned >= 5000 },
  { id: "boss", title: "Titan slayer", detail: "Defeat a world titan.", test: (s) => s.bosses >= 1 },
  { id: "boss_5", title: "Five titans", detail: "Defeat every world titan.", test: (s) => s.bosses >= 5 },
  { id: "survivor", title: "Last grain", detail: "Win a timed folio with under 5s left.", test: (_s, e) => !!e?.clutch },
  { id: "fog", title: "Fog walker", detail: "Clear a fog folio.", test: (s) => s.fogClears >= 1 },
  { id: "timed", title: "Against the lamp", detail: "Clear a time attack.", test: (s) => s.timedClears >= 1 },
  { id: "zen_5", title: "Quiet desk", detail: "Five zen folios.", test: (s) => s.zenClears >= 5 },
  { id: "combo", title: "Linked hand", detail: "Reach a 5-word combo.", test: (s) => s.bestCombo >= 5 },
  { id: "spin", title: "Fortune’s nod", detail: "Spin the wheel.", test: (s) => s.spins >= 1 },
  { id: "dailies_3", title: "Three mornings", detail: "Complete 3 dailies.", test: (s) => s.dailies >= 3 },
  { id: "shopper", title: "Patron", detail: "Spend 500 coins.", test: (s) => s.coinsSpent >= 500 },
  { id: "accuracy", title: "Sure eye", detail: "Finish with zero misreads.", test: (_s, e) => !!e?.noMistakes },
  { id: "legend", title: "Legend ink", detail: "Open a Legend folio.", test: (_s, e) => !!e?.legend },
];

export function newlyUnlocked(
  have: Record<string, number>,
  stats: Stats,
  extra?: Record<string, number | boolean>,
): AchievementDef[] {
  return ACHIEVEMENTS.filter((a) => !have[a.id] && a.test(stats, extra));
}
