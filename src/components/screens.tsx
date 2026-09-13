import {
  BarChart3,
  Check,
  Compass,
  Crown,
  Download,
  Lock,
  RotateCcw,
  Sparkles,
  Trophy,
  Upload,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import { cn, formatDuration, todayKey } from "@/lib/utils";
import { ACHIEVEMENTS } from "@/lib/game/achievements";
import { forgeWords } from "@/lib/game/forge";
import { dirFor, greetingKey, LANG_META, t } from "@/lib/game/i18n";
import {
  allCampaign,
  CAMPAIGN_COUNT,
  campaignLevel,
  dailySession,
  endlessSession,
  legendLevel,
  modeSession,
  sessionFromLevel,
  xpForLevel,
} from "@/lib/game/levels";
import { audio } from "@/lib/game/audio";
import { AVATARS, useGame } from "@/lib/game/store";
import type { LangId, PlaySession, ScreenId, ThemeId } from "@/lib/game/types";
import { CATEGORY_KEYS, CATEGORY_LABEL, WORD_MEANINGS, WORLD_META, allWords } from "@/lib/game/words";
import { CurrencyBar, Panel, ScreenHeader } from "./chrome";
import { LexoraMark } from "./mark";
import { Button } from "./ui/button";

export function Splash({ onBegin, ready }: { onBegin: () => void; ready?: boolean }) {
  const lang = useGame((s) => s.settings.lang);
  return (
    <button
      onClick={onBegin}
      className="flex min-h-dvh w-full flex-col items-center justify-center bg-bg px-8 text-center"
    >
      <div className="stagger-in flex flex-col items-center">
        <LexoraMark size={72} />
        <h1 className="mt-6 font-display text-5xl font-medium tracking-tight">Lexora</h1>
        <p className="mt-3 max-w-[16rem] text-sm text-muted">{t(lang, "tagline")}</p>
        <p className="mt-12 text-xs tracking-[0.22em] text-subtle uppercase">
          {ready === false ? "…" : t(lang, "tapToBegin")}
        </p>
      </div>
    </button>
  );
}

export function HomeScreen({
  onPlay,
  onGo,
}: {
  onPlay: (s: PlaySession) => void;
  onGo: (id: ScreenId) => void;
}) {
  const lang = useGame((s) => s.settings.lang);
  const name = useGame((s) => s.name);
  const campaignIndex = useGame((s) => s.campaignIndex);
  const stats = useGame((s) => s.stats);
  const lastDailyPlay = useGame((s) => s.lastDailyPlay);
  const xp = useGame((s) => s.xp);
  const progress = xpForLevel(xp);
  const level = campaignLevel(Math.min(campaignIndex, CAMPAIGN_COUNT));
  const dailyDone = lastDailyPlay === todayKey();

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <header className="safe-top flex items-start justify-between px-5 pt-5">
        <div>
          <p className="text-xs tracking-wide text-muted">{t(lang, greetingKey())}</p>
          <h1 className="font-display text-3xl font-medium tracking-tight">{name}</h1>
        </div>
        <CurrencyBar />
      </header>

      <div className="mt-2 px-5">
        <div className="h-1.5 overflow-hidden rounded-full bg-surface-2">
          <div
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.min(100, (progress.into / progress.need) * 100)}%` }}
          />
        </div>
        <p className="mt-1 text-[11px] tabular-nums text-subtle">
          {t(lang, "xp")} {progress.level} · {progress.into}/{progress.need}
        </p>
      </div>

      <div className="stagger-in mt-6 flex flex-1 flex-col gap-3 px-4 pb-4">
        <button
          onClick={() => onPlay(sessionFromLevel(level))}
          className="rounded-[28px] bg-paper px-5 py-6 text-left text-ink shadow-[var(--shadow-lift)]"
        >
          <p className="text-[11px] tracking-[0.18em] text-ink-soft uppercase">{t(lang, "continue")}</p>
          <p className="mt-1 font-display text-2xl font-medium">{level.title}</p>
          <p className="mt-1 text-sm text-ink-soft">
            {CATEGORY_LABEL[level.category]} · {level.size}×{level.size}
          </p>
        </button>

        <div className="grid grid-cols-2 gap-3">
          <Panel onClick={() => onGo("daily")} className="min-h-[7rem]">
            <p className="text-[11px] tracking-wide text-muted uppercase">{t(lang, "daily")}</p>
            <p className="mt-2 font-display text-lg">{dailyDone ? t(lang, "claimed") : t(lang, "daily")}</p>
            <p className="mt-1 text-xs text-subtle">{stats.currentStreak}-day {t(lang, "streak")}</p>
          </Panel>
          <Panel onClick={() => onGo("modes")} className="min-h-[7rem]">
            <p className="text-[11px] tracking-wide text-muted uppercase">{t(lang, "modes")}</p>
            <p className="mt-2 font-display text-lg">{t(lang, "zen")}</p>
            <p className="mt-1 text-xs text-subtle">{t(lang, "timed")} · {t(lang, "fog")}</p>
          </Panel>
        </div>

        <div className="grid grid-cols-3 gap-2">
          <Mini onClick={() => onGo("shop")} label={t(lang, "shop")} />
          <Mini onClick={() => onGo("spin")} label={t(lang, "spin")} />
          <Mini onClick={() => onGo("achievements")} label={t(lang, "achievements")} />
        </div>
      </div>
    </div>
  );
}

function Mini({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="min-h-12 rounded-2xl bg-surface text-sm shadow-[var(--shadow-border)]"
    >
      {label}
    </button>
  );
}

export function JourneyScreen({
  onPlay,
  onBack,
}: {
  onPlay: (s: PlaySession) => void;
  onBack: () => void;
}) {
  const lang = useGame((s) => s.settings.lang);
  const campaignIndex = useGame((s) => s.campaignIndex);
  const records = useGame((s) => s.records);
  const levels = useMemo(() => allCampaign(), []);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={t(lang, "journey")} onBack={onBack} right={<CurrencyBar />} />
      <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-8">
        {WORLD_META.map((world) => {
          const slice = levels.filter((l) => l.world === world.id);
          const cleared = slice.filter((l) => records[l.id]).length;
          return (
            <section key={world.id} className="mb-6">
              <div className="mb-3 flex items-end justify-between px-1">
                <div>
                  <h2 className="font-display text-xl">{world.name}</h2>
                  <p className="text-xs text-muted">{world.tagline}</p>
                </div>
                <p className="text-xs tabular-nums text-subtle">{cleared}/8</p>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {slice.map((lv) => {
                  const abs = (lv.world - 1) * 8 + lv.index;
                  const locked = abs > campaignIndex;
                  const rec = records[lv.id];
                  return (
                    <button
                      key={lv.id}
                      disabled={locked}
                      onClick={() => onPlay(sessionFromLevel(lv))}
                      className={cn(
                        "relative flex aspect-square flex-col items-center justify-center rounded-2xl bg-surface shadow-[var(--shadow-border)]",
                        locked && "opacity-40",
                        lv.boss && "bg-paper text-ink",
                      )}
                    >
                      {locked ? (
                        <Lock className="size-4" />
                      ) : (
                        <>
                          <span className="font-display text-lg">{lv.index}</span>
                          <span className="text-[9px] tracking-wide text-subtle">
                            {lv.boss ? t(lang, "boss") : `${lv.size}²`}
                          </span>
                          {rec && (
                            <span className="mt-0.5 text-[10px] text-accent">
                              {"★".repeat(rec.stars)}
                            </span>
                          )}
                        </>
                      )}
                    </button>
                  );
                })}
              </div>
            </section>
          );
        })}
        <section className="mb-4">
          <h2 className="mb-3 font-display text-xl">{t(lang, "legend")}</h2>
          <div className="grid grid-cols-4 gap-2">
            {Array.from({ length: 8 }, (_, i) => {
              const n = i + 1;
              const locked = campaignIndex < CAMPAIGN_COUNT;
              const lv = legendLevel(n);
              return (
                <button
                  key={lv.id}
                  disabled={locked}
                  onClick={() => onPlay(sessionFromLevel(lv, "classic"))}
                  className="flex aspect-square flex-col items-center justify-center rounded-2xl bg-surface-2 text-sm"
                >
                  {locked && campaignIndex < 20 ? <Lock className="size-4 text-subtle" /> : n}
                </button>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}

export function ModesScreen({
  onPlay,
  onBack,
}: {
  onPlay: (s: PlaySession) => void;
  onBack: () => void;
}) {
  const lang = useGame((s) => s.settings.lang);
  const [theme, setTheme] = useState("quiet library");
  const [busy, setBusy] = useState(false);
  const [wave, setWave] = useState(1);
  const [cat, setCat] = useState(CATEGORY_KEYS[0]!);

  const runForge = async () => {
    setBusy(true);
    audio.click();
    try {
      const res = await forgeWords({ data: { theme } });
      if (res.ok) {
        onPlay({
          mode: "forge",
          title: theme.slice(0, 24) || t(lang, "forge"),
          category: "verbs",
          seed: Date.now() >>> 0,
          size: 10,
          wordCount: res.words.length,
          dirs: 8,
          energyCost: 1,
          customWords: res.words,
        });
      } else {
        useGame.getState().setToast(t(lang, "forgeFail"));
        onPlay(modeSession("classic", { title: t(lang, "forge") }));
      }
    } catch {
      useGame.getState().setToast(t(lang, "forgeFail"));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={t(lang, "modes")} onBack={onBack} />
      <div className="flex-1 space-y-3 overflow-y-auto px-4 pb-8">
        {(
          [
            ["classic", "classic"],
            ["timed", "timed"],
            ["zen", "zen"],
            ["fog", "fog"],
          ] as const
        ).map(([mode, key]) => (
          <Panel key={mode} onClick={() => onPlay(modeSession(mode))}>
            <p className="font-display text-lg">{t(lang, key)}</p>
            <p className="mt-1 text-xs text-muted">{t(lang, "howTo")}</p>
          </Panel>
        ))}
        <Panel>
          <p className="font-display text-lg">{t(lang, "rush")}</p>
          <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
            {CATEGORY_KEYS.slice(0, 12).map((c) => (
              <button
                key={c}
                onClick={() => setCat(c)}
                className={cn(
                  "shrink-0 rounded-full px-3 py-1.5 text-xs",
                  cat === c ? "bg-paper text-ink" : "bg-surface-2 text-muted",
                )}
              >
                {CATEGORY_LABEL[c]}
              </button>
            ))}
          </div>
          <Button className="mt-3 w-full" onClick={() => onPlay(modeSession("rush", { category: cat }))}>
            {t(lang, "play")}
          </Button>
        </Panel>
        <Panel>
          <p className="font-display text-lg">{t(lang, "endless")}</p>
          <Button
            className="mt-3 w-full"
            variant="secondary"
            onClick={() => {
              onPlay(endlessSession(wave));
              setWave((w) => w + 1);
            }}
          >
            {t(lang, "play")} · {wave}
          </Button>
        </Panel>
        <Panel>
          <p className="font-display text-lg">{t(lang, "forge")}</p>
          <p className="mt-1 text-xs text-muted">{t(lang, "forgePrompt")}</p>
          <input
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="mt-3 h-11 w-full rounded-xl bg-bg px-3 text-sm shadow-[var(--shadow-border)] outline-none"
          />
          <Button className="mt-3 w-full" disabled={busy} onClick={() => void runForge()}>
            {busy ? t(lang, "forgeWait") : t(lang, "forgeGo")}
          </Button>
        </Panel>
      </div>
    </div>
  );
}

export function DailyScreen({
  onPlay,
  onBack,
}: {
  onPlay: (s: PlaySession) => void;
  onBack: () => void;
}) {
  const lang = useGame((s) => s.settings.lang);
  const claimDaily = useGame((s) => s.claimDaily);
  const lastClaim = useGame((s) => s.lastDailyClaim);
  const lastPlay = useGame((s) => s.lastDailyPlay);
  const streak = useGame((s) => s.stats.currentStreak);
  const key = todayKey();
  const claimed = lastClaim === key;
  const played = lastPlay === key;
  const bank = allWords();
  const wotd = bank[key.split("-").join("").length % bank.length]!;

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={t(lang, "daily")} onBack={onBack} right={<CurrencyBar />} />
      <div className="space-y-3 px-4">
        <Panel className="bg-paper text-ink">
          <p className="text-[11px] tracking-[0.16em] uppercase text-ink-soft">{t(lang, "wordOfDay")}</p>
          <p className="mt-2 font-display text-3xl tracking-[0.12em]">{wotd}</p>
          <p className="mt-2 text-sm text-ink-soft">{WORD_MEANINGS[wotd] ?? t(lang, "howTo")}</p>
        </Panel>
        <Panel>
          <p className="font-display text-lg">{t(lang, "dailyReward")}</p>
          <p className="mt-1 text-sm text-muted">
            {t(lang, "streak")} {streak}
          </p>
          <div className="mt-3 flex gap-1.5">
            {Array.from({ length: 7 }, (_, i) => (
              <div
                key={i}
                className={cn(
                  "h-8 flex-1 rounded-lg",
                  i < streak ? "bg-primary/80" : "bg-surface-2",
                )}
              />
            ))}
          </div>
          <Button
            className="mt-4 w-full"
            disabled={claimed}
            onClick={() => {
              const r = claimDaily();
              if (r) {
                audio.coin();
                useGame.getState().setToast(`+${r.coins}`);
              }
            }}
          >
            {claimed ? t(lang, "claimed") : t(lang, "claim")}
          </Button>
        </Panel>
        <Button
          className="w-full"
          variant="paper"
          disabled={played}
          onClick={() => onPlay(dailySession(key))}
        >
          {played ? t(lang, "claimed") : t(lang, "play")}
        </Button>
      </div>
    </div>
  );
}

export function ShopScreen({ onBack }: { onBack: () => void }) {
  const lang = useGame((s) => s.settings.lang);
  const buyHints = useGame((s) => s.buyHints);
  const refillEnergy = useGame((s) => s.refillEnergy);
  const spendCoins = useGame((s) => s.spendCoins);
  const ownedThemes = useGame((s) => s.ownedThemes);
  const patchSettings = useGame((s) => s.patchSettings);
  const toast = (ok: boolean, msg: string) => useGame.getState().setToast(ok ? msg : t(lang, "notEnough"));

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={t(lang, "shop")} onBack={onBack} right={<CurrencyBar />} />
      <div className="space-y-2 px-4">
        <ShopRow
          title={t(lang, "shopHints")}
          price="80"
          onBuy={() => toast(buyHints(), t(lang, "shopHints"))}
        />
        <ShopRow
          title={t(lang, "refill")}
          price="40"
          onBuy={() => toast(refillEnergy(false), t(lang, "refill"))}
        />
        <ShopRow
          title={t(lang, "shopEnergy")}
          price="8 gems"
          onBuy={() => toast(refillEnergy(true), t(lang, "shopEnergy"))}
        />
        {(["sepia", "amoled"] as ThemeId[]).map((th) => {
          const have = ownedThemes.includes(th);
          return (
            <ShopRow
              key={th}
              title={t(lang, th)}
              price={have ? t(lang, "owned") : "220"}
              disabled={have}
              onBuy={() => {
                if (!spendCoins(220)) return toast(false, "");
                useGame.setState({ ownedThemes: [...ownedThemes, th] });
                patchSettings({ theme: th });
                toast(true, t(lang, th));
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function ShopRow({
  title,
  price,
  onBuy,
  disabled,
}: {
  title: string;
  price: string;
  onBuy: () => void;
  disabled?: boolean;
}) {
  const lang = useGame((s) => s.settings.lang);
  return (
    <div className="flex items-center justify-between rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
      <div>
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs tabular-nums text-muted">{price}</p>
      </div>
      <Button size="sm" disabled={disabled} onClick={onBuy}>
        {disabled ? t(lang, "owned") : t(lang, "buy")}
      </Button>
    </div>
  );
}

export function SpinScreen({ onBack }: { onBack: () => void }) {
  const lang = useGame((s) => s.settings.lang);
  const lastSpin = useGame((s) => s.lastSpin);
  const spin = useGame((s) => s.spin);
  const [angle, setAngle] = useState(0);
  const [busy, setBusy] = useState(false);
  const [prize, setPrize] = useState<string | null>(null);
  const free = lastSpin !== todayKey();

  const go = () => {
    if (busy) return;
    const result = spin();
    if (!result) {
      useGame.getState().setToast(t(lang, "notEnough"));
      return;
    }
    setBusy(true);
    audio.click();
    const extra = 360 * 5 + Math.floor(Math.random() * 360);
    setAngle((a) => a + extra);
    window.setTimeout(() => {
      setPrize(result.label);
      audio.coin();
      setBusy(false);
    }, 1400);
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={t(lang, "spin")} onBack={onBack} right={<CurrencyBar />} />
      <div className="flex flex-1 flex-col items-center px-6">
        <div className="relative mt-4 size-56">
          <div
            className="size-full rounded-full bg-surface shadow-[var(--shadow-border)]"
            style={{
              background:
                "conic-gradient(from 0deg, var(--color-surface-2) 0 25%, var(--color-surface) 0 50%, var(--color-surface-2) 0 75%, var(--color-surface) 0 100%)",
              transform: `rotate(${angle}deg)`,
              transition: busy ? "transform 1.3s cubic-bezier(0.22, 1, 0.36, 1)" : "none",
            }}
          />
          <div className="absolute left-1/2 top-0 z-10 h-0 w-0 -translate-x-1/2 border-x-8 border-t-[16px] border-x-transparent border-t-accent" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="size-16 rounded-full bg-bg-elevated shadow-[var(--shadow-border)]" />
          </div>
        </div>
        <p className="mt-6 font-display text-xl">{prize ?? t(lang, "luckySpin")}</p>
        <Button className="mt-4 min-w-40" disabled={busy} onClick={go}>
          {t(lang, "spinNow")} {free ? "" : "· 60"}
        </Button>
      </div>
    </div>
  );
}

export function StatsScreen({ onBack }: { onBack: () => void }) {
  const lang = useGame((s) => s.settings.lang);
  const stats = useGame((s) => s.stats);
  const wordLog = useGame((s) => s.wordLog);
  const records = useGame((s) => s.records);
  const data = useMemo(() => {
    const rows = Object.values(records)
      .sort((a, b) => a.completedAt - b.completedAt)
      .slice(-10)
      .map((r, i) => ({ i: i + 1, t: Math.round(r.bestTime) }));
    return rows.length ? rows : [{ i: 1, t: 0 }];
  }, [records]);
  const topWord = Object.entries(wordLog).sort((a, b) => b[1] - a[1])[0];
  const acc =
    stats.wordsFound + stats.mistakes === 0
      ? 100
      : Math.round((stats.wordsFound / (stats.wordsFound + stats.mistakes)) * 100);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={t(lang, "stats")} onBack={onBack} />
      <div className="space-y-3 overflow-y-auto px-4 pb-8">
        <div className="grid grid-cols-2 gap-2">
          <Stat label={t(lang, "words")} value={stats.wordsFound} />
          <Stat label={t(lang, "journey")} value={stats.levelsCompleted} />
          <Stat label={t(lang, "accuracy")} value={`${acc}%`} />
          <Stat label={t(lang, "streak")} value={stats.longestStreak} />
          <Stat label={t(lang, "playtime")} value={formatDuration(stats.timePlayed)} />
          <Stat
            label={t(lang, "bestTime")}
            value={stats.fastestLevel ? formatDuration(stats.fastestLevel) : "—"}
          />
        </div>
        <Panel>
          <p className="mb-2 text-xs text-muted">{t(lang, "time")}</p>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <XAxis dataKey="i" hide />
                <Tooltip
                  contentStyle={{
                    background: "var(--color-bg-elevated)",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 12,
                  }}
                />
                <Area type="monotone" dataKey="t" stroke="var(--color-primary)" fill="var(--color-primary)" fillOpacity={0.2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        {topWord && (
          <Panel>
            <p className="text-xs text-muted">{t(lang, "favorite")}</p>
            <p className="mt-1 font-display text-2xl tracking-widest">{topWord[0]}</p>
            <p className="text-xs text-subtle">×{topWord[1]}</p>
          </Panel>
        )}
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]">
      <p className="text-[11px] text-muted">{label}</p>
      <p className="mt-1 font-display text-xl tabular-nums">{value}</p>
    </div>
  );
}

export function AchievementsScreen({ onBack }: { onBack: () => void }) {
  const lang = useGame((s) => s.settings.lang);
  const have = useGame((s) => s.achievements);
  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={t(lang, "achievements")} onBack={onBack} />
      <div className="grid grid-cols-1 gap-2 overflow-y-auto px-4 pb-8">
        {ACHIEVEMENTS.map((a) => {
          const on = !!have[a.id];
          return (
            <div
              key={a.id}
              className={cn(
                "flex items-center gap-3 rounded-2xl bg-surface px-4 py-3 shadow-[var(--shadow-border)]",
                !on && "opacity-50",
              )}
            >
              <Trophy className={cn("size-4", on ? "text-accent" : "text-subtle")} />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{a.title}</p>
                <p className="text-xs text-muted">{a.detail}</p>
              </div>
              {on && <Check className="size-4 text-success" />}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function ProfileScreen({ onBack }: { onBack: () => void }) {
  const lang = useGame((s) => s.settings.lang);
  const name = useGame((s) => s.name);
  const avatar = useGame((s) => s.avatar);
  const setName = useGame((s) => s.setName);
  const setAvatar = useGame((s) => s.setAvatar);
  const xp = useGame((s) => s.xp);
  const p = xpForLevel(xp);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={t(lang, "profile")} onBack={onBack} />
      <div className="px-4">
        <div className="flex flex-col items-center">
          <div className="flex size-20 items-center justify-center rounded-3xl bg-paper font-display text-4xl text-ink">
            {avatar}
          </div>
          <p className="mt-3 text-xs text-muted">
            {t(lang, "xp")} {p.level}
          </p>
        </div>
        <label className="mt-6 block text-xs text-muted">{t(lang, "playerName")}</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 h-11 w-full rounded-xl bg-surface px-3 text-sm shadow-[var(--shadow-border)] outline-none"
        />
        <p className="mt-5 text-xs text-muted">{t(lang, "avatars")}</p>
        <div className="mt-2 grid grid-cols-8 gap-2">
          {AVATARS.map((a) => (
            <button
              key={a}
              onClick={() => setAvatar(a)}
              className={cn(
                "flex aspect-square items-center justify-center rounded-xl bg-surface font-display",
                a === avatar && "bg-paper text-ink",
              )}
            >
              {a}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export function SettingsScreen({ onBack }: { onBack: () => void }) {
  const s = useGame((s) => s.settings);
  const patch = useGame((s) => s.patchSettings);
  const lang = s.lang;
  const exportSave = useGame((s) => s.exportSave);
  const importSave = useGame((s) => s.importSave);
  const resetAll = useGame((s) => s.resetAll);
  const [openReset, setOpenReset] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(exportSave());
      useGame.getState().setToast(t(lang, "saveCopied"));
    } catch {
      useGame.getState().setToast(t(lang, "saveCopied"));
    }
  };

  const load = async () => {
    const raw = window.prompt("JSON");
    if (!raw) return;
    const ok = importSave(raw);
    useGame.getState().setToast(ok ? t(lang, "saveImported") : t(lang, "notEnough"));
  };

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={t(lang, "settings")} onBack={onBack} />
      <div className="space-y-5 overflow-y-auto px-4 pb-10">
        <section>
          <h2 className="mb-2 text-xs tracking-wide text-muted uppercase">{t(lang, "language")}</h2>
          <div className="flex flex-wrap gap-1.5">
            {LANG_META.map((l) => (
              <button
                key={l.id}
                onClick={() => {
                  patch({ lang: l.id });
                  document.documentElement.dir = dirFor(l.id);
                  document.documentElement.lang = l.id;
                }}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs",
                  s.lang === l.id ? "bg-paper text-ink" : "bg-surface text-muted",
                )}
              >
                {l.label}
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-2 text-xs tracking-wide text-muted uppercase">{t(lang, "theme")}</h2>
          <div className="grid grid-cols-4 gap-2">
            {(["dark", "light", "sepia", "amoled"] as ThemeId[]).map((th) => (
              <button
                key={th}
                onClick={() => {
                  patch({ theme: th });
                  document.documentElement.dataset.theme = th;
                }}
                className={cn(
                  "h-11 rounded-2xl text-xs",
                  s.theme === th ? "bg-paper text-ink" : "bg-surface text-muted",
                )}
              >
                {t(lang, th)}
              </button>
            ))}
          </div>
        </section>
        <section>
          <h2 className="mb-2 text-xs tracking-wide text-muted uppercase">{t(lang, "audio")}</h2>
          <Slider label={t(lang, "masterVol")} value={s.master} onChange={(v) => { patch({ master: v }); audio.setVol("master", v); }} />
          <Slider label={t(lang, "sfxVol")} value={s.sfx} onChange={(v) => { patch({ sfx: v }); audio.setVol("sfx", v); }} />
          <Slider label={t(lang, "musicVol")} value={s.music} onChange={(v) => { patch({ music: v }); audio.setVol("music", v); }} />
        </section>
        <section className="space-y-1">
          <h2 className="mb-2 text-xs tracking-wide text-muted uppercase">{t(lang, "gameplay")}</h2>
          <Toggle label={t(lang, "showDirections")} on={s.showDirections} onChange={(v) => patch({ showDirections: v })} />
          <Toggle label={t(lang, "autoHint")} on={s.autoHint} onChange={(v) => patch({ autoHint: v })} />
          <Toggle label={t(lang, "vibration")} on={s.vibration} onChange={(v) => patch({ vibration: v })} />
          <Toggle label={t(lang, "screenShake")} on={s.screenShake} onChange={(v) => patch({ screenShake: v })} />
        </section>
        <section className="space-y-1">
          <h2 className="mb-2 text-xs tracking-wide text-muted uppercase">{t(lang, "access")}</h2>
          <Toggle label={t(lang, "reduceMotion")} on={s.reduceMotion} onChange={(v) => {
            patch({ reduceMotion: v });
            document.documentElement.dataset.reduceMotion = v ? "on" : "off";
          }} />
          <Toggle label={t(lang, "largeText")} on={s.largeText} onChange={(v) => patch({ largeText: v })} />
          <Toggle label={t(lang, "highContrast")} on={s.highContrast} onChange={(v) => patch({ highContrast: v })} />
          <Toggle label={t(lang, "colorBlind")} on={s.colorBlind} onChange={(v) => patch({ colorBlind: v })} />
        </section>
        <section className="space-y-2">
          <h2 className="mb-2 text-xs tracking-wide text-muted uppercase">{t(lang, "data")}</h2>
          <Button variant="secondary" className="w-full" onClick={() => void copy()}>
            <Download className="size-4" /> {t(lang, "exportSave")}
          </Button>
          <Button variant="secondary" className="w-full" onClick={() => void load()}>
            <Upload className="size-4" /> {t(lang, "importSave")}
          </Button>
          <Button variant="ghost" className="w-full text-danger" onClick={() => setOpenReset(true)}>
            <RotateCcw className="size-4" /> {t(lang, "reset")}
          </Button>
        </section>
      </div>
      {openReset && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-bg/70 p-6">
          <div className="w-full max-w-sm rounded-[24px] bg-bg-elevated p-5">
            <p className="font-display text-lg">{t(lang, "confirmReset")}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="secondary" className="flex-1" onClick={() => setOpenReset(false)}>
                {t(lang, "cancel")}
              </Button>
              <Button
                variant="danger"
                className="flex-1"
                onClick={() => {
                  resetAll();
                  setOpenReset(false);
                }}
              >
                {t(lang, "confirm")}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Slider({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <label className="mb-3 block">
      <span className="flex justify-between text-sm">
        {label}
        <span className="tabular-nums text-muted">{Math.round(value * 100)}</span>
      </span>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[var(--color-primary)]"
      />
    </label>
  );
}

function Toggle({
  label,
  on,
  onChange,
}: {
  label: string;
  on: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!on)}
      className="flex h-12 w-full items-center justify-between rounded-2xl bg-surface px-4 text-sm shadow-[var(--shadow-border)]"
    >
      {label}
      <span className={cn("h-6 w-10 rounded-full p-0.5", on ? "bg-primary" : "bg-surface-2")}>
        <span className={cn("block size-5 rounded-full bg-paper transition-transform", on && "translate-x-4")} />
      </span>
    </button>
  );
}

export function DictionaryScreen({
  onBack,
  onMore,
}: {
  onBack: () => void;
  onMore: (id: ScreenId) => void;
}) {
  const lang = useGame((s) => s.settings.lang);
  const [q, setQ] = useState("");
  const words = useMemo(() => allWords().sort(), []);
  const filtered = words.filter((w) => w.includes(q.toUpperCase())).slice(0, 80);

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <ScreenHeader title={t(lang, "more")} onBack={onBack} />
      <div className="grid grid-cols-2 gap-2 px-4">
        {(
          [
            ["modes", Compass],
            ["spin", Sparkles],
            ["stats", BarChart3],
            ["achievements", Trophy],
            ["profile", User],
            ["settings", Crown],
          ] as const
        ).map(([id, Icon]) => (
          <button
            key={id}
            onClick={() => onMore(id)}
            className="flex min-h-14 items-center gap-3 rounded-2xl bg-surface px-4 text-left shadow-[var(--shadow-border)]"
          >
            <Icon className="size-4 text-muted" />
            <span className="text-sm">{t(lang, id)}</span>
          </button>
        ))}
      </div>
      <div className="mt-5 px-4">
        <p className="text-xs text-muted">{t(lang, "dictionary")}</p>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="APPLE"
          className="mt-2 h-11 w-full rounded-xl bg-surface px-3 text-sm tracking-widest shadow-[var(--shadow-border)] outline-none"
        />
        <ul className="mt-3 max-h-56 space-y-1 overflow-y-auto">
          {filtered.map((w) => (
            <li key={w} className="flex items-center justify-between rounded-xl px-2 py-1.5 text-sm">
              <span className="font-display tracking-widest">{w}</span>
              {WORD_MEANINGS[w] && <span className="max-w-[60%] truncate text-[11px] text-muted">{WORD_MEANINGS[w]}</span>}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function ResultScreen({
  coins,
  xp,
  won,
  perfect,
  elapsed,
  found,
  total,
  hintsUsed,
  marks,
  onNext,
  onHome,
}: {
  coins: number;
  xp: number;
  won: boolean;
  perfect: boolean;
  elapsed: number;
  found: number;
  total: number;
  hintsUsed: number;
  marks: string[];
  onNext: () => void;
  onHome: () => void;
}) {
  const lang = useGame((s) => s.settings.lang);
  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-bg px-6 text-center">
      {won && <Confetti />}
      <p className="text-xs tracking-[0.2em] text-muted uppercase">
        {won ? t(lang, "levelComplete") : t(lang, "resultLose")}
      </p>
      <h1 className="mt-2 font-display text-4xl">{won ? t(lang, "resultWin") : `${found}/${total}`}</h1>
      <div className="mt-6 grid w-full max-w-sm grid-cols-3 gap-2">
        <Stat label={t(lang, "coins")} value={`+${coins}`} />
        <Stat label={t(lang, "xp")} value={`+${xp}`} />
        <Stat label={t(lang, "time")} value={formatDuration(elapsed)} />
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {perfect && <span className="rounded-full bg-paper px-3 py-1 text-xs text-ink">{t(lang, "perfect")}</span>}
        {hintsUsed === 0 && won && (
          <span className="rounded-full bg-surface px-3 py-1 text-xs">{t(lang, "noHints")}</span>
        )}
        {marks.map((m) => (
          <span key={m} className="rounded-full bg-surface px-3 py-1 text-xs text-accent">
            {m}
          </span>
        ))}
      </div>
      <div className="mt-8 flex w-full max-w-sm flex-col gap-2">
        {won && <Button onClick={onNext}>{t(lang, "next")}</Button>}
        <Button variant={won ? "secondary" : "primary"} onClick={onHome}>
          {t(lang, "home")}
        </Button>
      </div>
    </div>
  );
}

function Confetti() {
  const bits = useMemo(
    () =>
      Array.from({ length: 18 }, (_, i) => ({
        i,
        left: `${6 + ((i * 17) % 90)}%`,
        delay: `${(i % 6) * 40}ms`,
        color: i % 3 === 0 ? "var(--color-primary)" : i % 3 === 1 ? "var(--color-accent)" : "var(--color-paper)",
        dx: `${(i % 2 === 0 ? -1 : 1) * (20 + (i % 5) * 8)}px`,
      })),
    [],
  );
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {bits.map((b) => (
        <span
          key={b.i}
          className="confetti-bit"
          style={{
            left: b.left,
            background: b.color,
            animationDelay: b.delay,
            // @ts-expect-error custom property
            "--dx": b.dx,
          }}
        />
      ))}
    </div>
  );
}
