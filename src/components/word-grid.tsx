import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { cellsEqual, linePath, matchPlacement } from "@/lib/game/generator";
import type { Cell, Puzzle } from "@/lib/game/types";

const FOUND_STROKES = ["#5c68b8", "#3f8f74", "#8a7048", "#4f6fa8", "#7a5ea8", "#3d7a72"];

function cellKey(c: Cell) {
  return `${c.r},${c.c}`;
}

function centers(cells: Cell[], size: number, n: number) {
  const u = size / n;
  return cells.map((c) => ({
    x: c.c * u + u / 2,
    y: c.r * u + u / 2,
  }));
}

export function WordGrid({
  puzzle,
  found,
  fog,
  hinted,
  largeText,
  colorBlind,
  disabled,
  onFound,
  onMiss,
  onSelectTick,
}: {
  puzzle: Puzzle;
  found: Set<string>;
  fog?: boolean;
  hinted: Cell[];
  largeText?: boolean;
  colorBlind?: boolean;
  disabled?: boolean;
  onFound: (word: string) => void;
  onMiss: () => void;
  onSelectTick?: () => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [px, setPx] = useState(320);
  const [path, setPath] = useState<Cell[]>([]);
  const [bad, setBad] = useState(false);
  const selecting = useRef(false);
  const startRef = useRef<Cell | null>(null);
  const pathRef = useRef<Cell[]>([]);
  const lastTick = useRef("");

  const n = puzzle.size;
  const remaining = useMemo(() => {
    const s = new Set(puzzle.words);
    for (const w of found) s.delete(w);
    return s;
  }, [puzzle.words, found]);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const w = el.clientWidth;
      setPx(Math.max(200, w));
    });
    ro.observe(el);
    setPx(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  const foundCells = useMemo(() => {
    const m = new Set<string>();
    for (const p of puzzle.placements) {
      if (found.has(p.word)) for (const c of p.cells) m.add(cellKey(c));
    }
    return m;
  }, [puzzle.placements, found]);

  const hintedSet = useMemo(() => new Set(hinted.map(cellKey)), [hinted]);
  const pathSet = useMemo(() => new Set(path.map(cellKey)), [path]);

  const visible = useCallback(
    (c: Cell) => {
      if (!fog) return true;
      const k = cellKey(c);
      return foundCells.has(k) || pathSet.has(k) || hintedSet.has(k);
    },
    [fog, foundCells, pathSet, hintedSet],
  );

  const atPoint = useCallback(
    (clientX: number, clientY: number): Cell | null => {
      const el = wrapRef.current;
      if (!el) return null;
      const rect = el.getBoundingClientRect();
      const u = rect.width / n;
      const c = Math.floor((clientX - rect.left) / u);
      const r = Math.floor((clientY - rect.top) / u);
      if (r < 0 || c < 0 || r >= n || c >= n) return null;
      return { r, c };
    },
    [n],
  );

  const updatePath = useCallback(
    (cell: Cell) => {
      const start = startRef.current;
      if (!start) {
        setPath([cell]);
        pathRef.current = [cell];
        startRef.current = cell;
        return;
      }
      const next = linePath(start, cell).filter(
        (x) => x.r >= 0 && x.c >= 0 && x.r < n && x.c < n,
      );
      if (next.length) {
        const key = next.map(cellKey).join("|");
        if (key !== lastTick.current) {
          lastTick.current = key;
          if (next.length !== path.length) onSelectTick?.();
        }
        setPath(next);
        pathRef.current = next;
      }
    },
    [n, onSelectTick, path.length],
  );

  const endSelect = useCallback(() => {
    if (!selecting.current) return;
    selecting.current = false;
    const cells = pathRef.current;
    startRef.current = null;
    const hit = matchPlacement(puzzle.placements, cells, remaining);
    if (hit) {
      onFound(hit.word);
      pathRef.current = [];
      setPath([]);
    } else {
      if (cells.length >= 3) {
        onMiss();
        setBad(true);
        window.setTimeout(() => setBad(false), 220);
      }
      pathRef.current = [];
      setPath([]);
    }
    lastTick.current = "";
  }, [puzzle.placements, remaining, onFound, onMiss]);

  useEffect(() => {
    const up = () => endSelect();
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    return () => {
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
    };
  }, [endSelect]);

  const onPointerDown = (e: React.PointerEvent) => {
    if (disabled) return;
    e.preventDefault();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    const cell = atPoint(e.clientX, e.clientY);
    if (!cell) return;
    selecting.current = true;
    startRef.current = cell;
    pathRef.current = [cell];
    setPath([cell]);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!selecting.current) return;
    const cell = atPoint(e.clientX, e.clientY);
    if (cell) updatePath(cell);
  };

  const strokeW = px / n * 0.72;
  const fontPx = Math.max(12, (px / n) * (largeText ? 0.5 : 0.42));

  return (
    <div
      ref={wrapRef}
      className={cn(
        "paper-grid relative aspect-square w-full touch-none overflow-hidden rounded-[22px] select-none",
        bad && "shake-error",
      )}
      style={{ touchAction: "none" }}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      role="grid"
      aria-label="Word search grid"
    >
      <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 ${px} ${px}`}>
        {puzzle.placements.map((p, i) => {
          if (!found.has(p.word) || p.cells.length < 2) return null;
          const pts = centers(p.cells, px, n);
          const a = pts[0]!;
          const b = pts[pts.length - 1]!;
          return (
            <line
              key={p.word}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={colorBlind ? FOUND_STROKES[i % FOUND_STROKES.length] : "var(--color-found)"}
              strokeWidth={strokeW}
              strokeLinecap="round"
              opacity={0.38}
            />
          );
        })}
        {path.length >= 2 &&
          (() => {
            const pts = centers(path, px, n);
            const a = pts[0]!;
            const b = pts[pts.length - 1]!;
            return (
              <line
                x1={a.x}
                y1={a.y}
                x2={b.x}
                y2={b.y}
                stroke="var(--color-primary)"
                strokeWidth={strokeW}
                strokeLinecap="round"
                opacity={0.55}
              />
            );
          })()}
      </svg>
      <div
        className="relative grid h-full w-full"
        style={{ gridTemplateColumns: `repeat(${n}, 1fr)`, gridTemplateRows: `repeat(${n}, 1fr)` }}
      >
        {puzzle.grid.map((row, r) =>
          row.map((ch, c) => {
            const cell = { r, c };
            const k = cellKey(cell);
            const on = pathSet.has(k);
            const done = foundCells.has(k);
            const glow = hintedSet.has(k) && !done;
            const show = visible(cell);
            return (
              <div
                key={k}
                role="gridcell"
                className={cn(
                  "relative flex items-center justify-center font-display font-medium text-ink",
                  on && "text-primary",
                  done && "text-ink",
                )}
                style={{ fontSize: fontPx, letterSpacing: "0.02em" }}
              >
                {glow && (
                  <span className="absolute inset-[18%] rounded-full bg-accent/35" />
                )}
                <span className={cn("relative", !show && "opacity-0")}>{ch}</span>
                {fog && !show && (
                  <span className="absolute inset-[22%] rounded-[4px] bg-ink/18" />
                )}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
}

export function sameCell(a: Cell | null, b: Cell | null) {
  return !!a && !!b && cellsEqual(a, b);
}
