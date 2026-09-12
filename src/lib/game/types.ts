export type ThemeId = "dark" | "light" | "sepia" | "amoled";
export type LangId =
  | "en"
  | "ur"
  | "hi"
  | "ar"
  | "ru"
  | "bn"
  | "tr"
  | "es"
  | "fr"
  | "de"
  | "zh"
  | "ja";

export type PlayMode =
  | "classic"
  | "timed"
  | "zen"
  | "fog"
  | "rush"
  | "daily"
  | "endless"
  | "forge";

export type ScreenId =
  | "splash"
  | "home"
  | "journey"
  | "play"
  | "shop"
  | "stats"
  | "achievements"
  | "settings"
  | "profile"
  | "modes"
  | "daily"
  | "spin"
  | "dictionary"
  | "result";

export interface Cell {
  r: number;
  c: number;
}

export interface Placement {
  word: string;
  cells: Cell[];
}

export interface Puzzle {
  size: number;
  grid: string[][];
  placements: Placement[];
  words: string[];
  category: string;
  seed: number;
}

export interface LevelDef {
  id: string;
  world: number;
  index: number;
  title: string;
  size: number;
  wordCount: number;
  category: string;
  difficulty: "easy" | "medium" | "hard" | "expert";
  dirs: number;
  boss?: boolean;
  timeLimit?: number;
}

export interface PlaySession {
  mode: PlayMode;
  levelId?: string;
  title: string;
  category: string;
  seed: number;
  size: number;
  wordCount: number;
  dirs: number;
  timeLimit?: number;
  energyCost: number;
  customWords?: string[];
}

export interface LevelResult {
  session: PlaySession;
  found: string[];
  words: string[];
  elapsed: number;
  hintsUsed: number;
  mistakes: number;
  comboMax: number;
  coins: number;
  xp: number;
  perfect: boolean;
  won: boolean;
}

export interface LevelRecord {
  stars: number;
  bestTime: number;
  hintsUsed: number;
  completedAt: number;
}

export interface Settings {
  lang: LangId;
  theme: ThemeId;
  master: number;
  music: number;
  sfx: number;
  reduceMotion: boolean;
  screenShake: boolean;
  vibration: boolean;
  showDirections: boolean;
  largeText: boolean;
  colorBlind: boolean;
  highContrast: boolean;
  autoHint: boolean;
  confirmQuit: boolean;
}

export interface Stats {
  wordsFound: number;
  levelsCompleted: number;
  timePlayed: number;
  hintsUsed: number;
  mistakes: number;
  longestStreak: number;
  currentStreak: number;
  coinsEarned: number;
  coinsSpent: number;
  perfects: number;
  dailies: number;
  bosses: number;
  fogClears: number;
  timedClears: number;
  zenClears: number;
  bestCombo: number;
  fastestLevel: number;
  spins: number;
}
