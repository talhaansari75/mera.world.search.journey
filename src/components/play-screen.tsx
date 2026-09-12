import { Pause, Play, Lightbulb, Type, WholeWord } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { formatDuration } from "@/lib/utils";
import { generatePuzzle } from "@/lib/game/generator";
import { t } from "@/lib/game/i18n";
import { CATEGORY_LABEL } from "@/lib/game/words";
import { audio } from "@/lib/game/audio";
import { HINT_COST, useGame } from "@/lib/game/store";
import type { Cell, LevelResult, PlaySession } from "@/lib/game/types";
import { Button } from "./ui/button";
import { WordGrid } from "./word-grid";

export function PlayScreen({
  session,
  onExit,
  onResult,
}: {
  session: PlaySession;
  onExit: () => void;
  onResult: (r: LevelResult) => void;
}) {
  const lang = useGame((s) => s.settings.lang);
  const settings = useGame((s) => s.settings);
  const spendCoins = useGame((s) => s.spendCoins);
  const hintPacks = useGame((s) => s.hintPacks);
  const logWord = useGame((s) => s.logWord);
  const seenTutorial = useGame((s) => s.seenTutorial);

  const puzzle = useMemo(
    () =>
      generatePuzzle({
        size: session.size,
        wordCount: session.wordCount,
        category: session.category,
        seed: session.seed,
        dirs: session.dirs,
        customWords: session.customWords,
      }),
    [session],
  );

  const [found, setFound] = useState<Set<string>>(() => new Set());
  const [paused, setPaused] = useState(false);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [mistakes, setMistakes] = useState(0);
  const [combo, setCombo] = useState(0);
  const [comboMax, setComboMax] = useState(0);
  const [hinted, setHinted] = useState<Cell[]>([]);
  const [showHow, setShowHow] = useState(!seenTutorial);
  const [ended, setEnded] = useState(false);
  const startedAt = useRef(performance.now());
  const pausedAt = useRef(0);
  const pausedTotal = useRef(0);
  const lastFind = useRef(0);
  const [tick, setTick] = useState(0);

  const elapsed = Math.max(0, (tick - startedAt.current - pausedTotal.current) / 1000);
  const timeLeft = session.timeLimit ? Math.max(0, session.timeLimit - elapsed) : null;

  useEffect(() => {
    let id = 0;
    const loop = (t: number) => {
      if (!paused) setTick(t);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [paused]);

  useEffect(() => {
    if (paused) pausedAt.current = performance.now();
    else if (pausedAt.current) {
      pausedTotal.current += performance.now() - pausedAt.current;
      pausedAt.current = 0;
    }
  }, [paused]);

  const finish = (won: boolean) => {
    if (ended) return;
    setEnded(true);
    const foundList = [...found];
    if (won) audio.win();
    const noHint = hintsUsed === 0;
    const perfect = mistakes === 0 && won;
    const speed = won && session.timeLimit && elapsed < session.timeLimit * 0.5;
    const coins = won
      ? 50 +
        foundList.reduce((n, w) => n + Math.max(0, w.length - 3) * 4, 0) +
        (noHint ? 30 : 0) +
        (perfect ? 50 : 0) +
        (speed ? 20 : 0) +
        comboMax * 4
      : Math.max(8, foundList.length * 6);
    const xp = (won ? 28 : 8) + foundList.length * 4 + (session.levelId?.includes("-8") ? 40 : 0);
    onResult({
      session,
      found: foundList,
      words: puzzle.words,
      elapsed,
      hintsUsed,
      mistakes,
      comboMax,
      coins,
      xp,
      perfect,
      won,
    });
  };

  useEffect(() => {
    if (timeLeft === 0 && !ended) finish(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, ended]);

  const onFound = (word: string) => {
    if (found.has(word) || ended) return;
    const next = new Set(found);
    next.add(word);
    setFound(next);
    logWord(word);
    audio.found();
    if (settings.vibration) navigator.vibrate?.(14);
    const now = performance.now();
    const nextCombo = now - lastFind.current < 6000 ? combo + 1 : 1;
    lastFind.current = now;
    setCombo(nextCombo);
    setComboMax((m) => Math.max(m, nextCombo));
    setHinted([]);
    setShowHow(false);
    if (next.size >= puzzle.words.length) {
      window.setTimeout(() => finish(true), 280);
    }
  };

  const onMiss = () => {
    setMistakes((m) => m + 1);
    setCombo(0);
    audio.error();
    if (settings.vibration) navigator.vibrate?.([8, 30, 8]);
  };

  const payHint = (kind: keyof typeof HINT_COST) => {
    const cost = HINT_COST[kind];
    const packs = useGame.getState().hintPacks;
    if (packs > 0) {
      useGame.setState({ hintPacks: packs - 1 });
      return true;
    }
    return spendCoins(cost);
  };

  const remainingPlacements = puzzle.placements.filter((p) => !found.has(p.word));

  const useHint = (kind: "first" | "letter" | "word") => {
    if (ended || remainingPlacements.length === 0) return;
    if (!payHint(kind)) {
      useGame.getState().setToast(t(lang, "notEnough"));
      return;
    }
    audio.hint();
    setHintsUsed((n) => n + 1);
    const p = remainingPlacements[0]!;
    if (kind === "first") setHinted([p.cells[0]!]);
    if (kind === "letter") {
      const idx = Math.floor(p.cells.length / 2);
      setHinted([p.cells[idx]!]);
    }
    if (kind === "word") {
      setHinted(p.cells);
      window.setTimeout(() => onFound(p.word), 280);
    }
  };

  return (
    <div className="flex min-h-dvh flex-col bg-bg">
      <header className="safe-top flex items-center gap-2 px-3 pt-3">
        <Button variant="ghost" size="icon" onClick={() => setPaused(true)} aria-label={t(lang, "pause")}>
          <Pause className="size-5" />
        </Button>
        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-base font-medium leading-tight">{session.title}</p>
          <p className="text-[11px] text-muted">
            {CATEGORY_LABEL[session.category] ?? session.category}
            {combo > 1 ? ` · ${t(lang, "combo")} ×${combo}` : ""}
          </p>
        </div>
        <div className="rounded-full bg-surface px-3 py-1.5 text-xs tabular-nums text-fg shadow-[var(--shadow-border)]">
          {timeLeft != null ? formatDuration(timeLeft) : formatDuration(elapsed)}
        </div>
      </header>

      <div className="flex-1 px-3 pt-3">
        <WordGrid
          puzzle={puzzle}
          found={found}
          fog={session.mode === "fog"}
          hinted={hinted}
          largeText={settings.largeText}
          colorBlind={settings.colorBlind}
          disabled={paused || ended}
          onFound={onFound}
          onMiss={onMiss}
          onSelectTick={() => audio.select()}
        />
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {puzzle.words.map((w) => {
            const done = found.has(w);
            return (
              <li
                key={w}
                className={`rounded-full px-2.5 py-1 text-[11px] tracking-[0.14em] ${
                  done ? "bg-surface text-subtle line-through" : "bg-surface-2 text-fg"
                }`}
              >
                {w}
              </li>
            );
          })}
        </ul>
      </div>

      <div className="safe-bottom grid grid-cols-3 gap-2 px-3 pt-2">
        <HintBtn
          icon={<Type className="size-4" />}
          label={t(lang, "hintFirst")}
          cost={hintPacks > 0 ? "pack" : String(HINT_COST.first)}
          onClick={() => useHint("first")}
        />
        <HintBtn
          icon={<Lightbulb className="size-4" />}
          label={t(lang, "hintLetter")}
          cost={hintPacks > 0 ? "pack" : String(HINT_COST.letter)}
          onClick={() => useHint("letter")}
        />
        <HintBtn
          icon={<WholeWord className="size-4" />}
          label={t(lang, "hintWord")}
          cost={hintPacks > 0 ? "pack" : String(HINT_COST.word)}
          onClick={() => useHint("word")}
        />
      </div>

      {showHow && (
        <div className="pointer-events-none absolute inset-x-0 top-[30%] z-10 flex justify-center px-8">
          <p className="rounded-2xl bg-ink/80 px-4 py-3 text-center text-sm text-paper shadow-[var(--shadow-lift)]">
            {t(lang, "tutorial")}
          </p>
        </div>
      )}

      {paused && (
        <div className="fixed inset-0 z-30 flex items-end justify-center bg-bg/70 p-4 backdrop-blur-sm sm:items-center">
          <div className="w-full max-w-sm rounded-[28px] bg-bg-elevated p-5 shadow-[var(--shadow-lift)]">
            <h2 className="font-display text-2xl">{t(lang, "pause")}</h2>
            <p className="mt-1 text-sm text-muted">
              {found.size}/{puzzle.words.length} {t(lang, "found")}
            </p>
            <div className="mt-5 flex flex-col gap-2">
              <Button
                onClick={() => {
                  audio.click();
                  setPaused(false);
                }}
              >
                <Play className="size-4" />
                {t(lang, "resume")}
              </Button>
              <Button variant="secondary" onClick={onExit}>
                {t(lang, "quit")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function HintBtn({
  icon,
  label,
  cost,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  cost: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex min-h-12 flex-col items-center justify-center rounded-2xl bg-surface px-1 py-2 text-center shadow-[var(--shadow-border)]"
    >
      <span className="text-muted">{icon}</span>
      <span className="mt-0.5 text-[10px] text-fg">{label}</span>
      <span className="text-[10px] tabular-nums text-subtle">{cost}</span>
    </button>
  );
}
