import { BookOpen, Compass, Home, MoreHorizontal, Sparkles, Store } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import type { ScreenId } from "@/lib/game/types";
import { t } from "@/lib/game/i18n";
import { ENERGY_MAX_VALUE, ENERGY_MS_VALUE, currentEnergy, useGame } from "@/lib/game/store";
import { Button } from "./ui/button";

export function CurrencyBar() {
  const coins = useGame((s) => s.coins);
  const gems = useGame((s) => s.gems);
  const energyRaw = useGame((s) => s.energy);
  const energyAt = useGame((s) => s.energyAt);
  const lang = useGame((s) => s.settings.lang);
  const energy = currentEnergy(energyRaw, energyAt);
  const [, setPulse] = useState(0);
  useEffect(() => {
    if (energy >= ENERGY_MAX_VALUE) return;
    const id = window.setInterval(() => setPulse((n) => n + 1), 1000);
    return () => window.clearInterval(id);
  }, [energy]);
  const remain = energy >= ENERGY_MAX_VALUE ? 0 : ENERGY_MS_VALUE - ((Date.now() - energyAt) % ENERGY_MS_VALUE);
  const m = Math.floor(remain / 60000);
  const sec = Math.floor((remain % 60000) / 1000);

  return (
    <div className="flex items-center gap-2">
      <Chip label={String(coins)} title={t(lang, "coins")} tone="accent" />
      <Chip label={String(gems)} title={t(lang, "gems")} tone="primary" />
      <Chip
        label={`${energy}/${ENERGY_MAX_VALUE}`}
        title={energy < ENERGY_MAX_VALUE ? `${t(lang, "nextEnergy")} ${m}:${String(sec).padStart(2, "0")}` : t(lang, "energy")}
        tone="plain"
      />
    </div>
  );
}

function Chip({
  label,
  title,
  tone,
}: {
  label: string;
  title: string;
  tone: "accent" | "primary" | "plain";
}) {
  return (
    <div
      title={title}
      className={cn(
        "flex h-8 min-w-12 items-center justify-center rounded-full px-2.5 text-xs tabular-nums",
        "shadow-[0_0_0_1px_color-mix(in_oklab,var(--color-fg)_10%,transparent)]",
        tone === "accent" && "bg-surface text-accent",
        tone === "primary" && "bg-surface text-primary",
        tone === "plain" && "bg-surface text-fg",
      )}
    >
      {label}
    </div>
  );
}

const NAV: { id: ScreenId; icon: typeof Home; key: string }[] = [
  { id: "home", icon: Home, key: "home" },
  { id: "journey", icon: Compass, key: "journey" },
  { id: "daily", icon: Sparkles, key: "daily" },
  { id: "shop", icon: Store, key: "shop" },
  { id: "dictionary", icon: BookOpen, key: "more" },
];

export function BottomNav({
  screen,
  onGo,
}: {
  screen: ScreenId;
  onGo: (id: ScreenId) => void;
}) {
  const lang = useGame((s) => s.settings.lang);
  return (
    <nav className="safe-bottom grid grid-cols-5 gap-1 border-t border-border bg-bg/90 px-2 pt-2 backdrop-blur-md">
      {NAV.map((item) => {
        const active =
          screen === item.id ||
          (item.id === "dictionary" &&
            ["dictionary", "stats", "achievements", "settings", "profile", "spin", "modes"].includes(screen));
        const Icon = item.icon;
        return (
          <button
            key={item.id}
            onClick={() => onGo(item.id)}
            className={cn(
              "flex min-h-11 flex-col items-center justify-center gap-0.5 rounded-xl text-[10px] tracking-wide",
              active ? "text-fg" : "text-subtle",
            )}
          >
            <Icon className="size-5" strokeWidth={active ? 2.2 : 1.7} />
            {t(lang, item.key)}
          </button>
        );
      })}
    </nav>
  );
}

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  return (
    <header className="safe-top flex items-center gap-2 px-4 pb-3 pt-3">
      {onBack ? (
        <Button variant="ghost" size="icon" onClick={onBack} aria-label="Back">
          <span className="text-lg leading-none">‹</span>
        </Button>
      ) : (
        <span className="size-11" />
      )}
      <h1 className="flex-1 text-center font-display text-xl font-medium tracking-tight">{title}</h1>
      <div className="flex min-w-11 justify-end">{right}</div>
    </header>
  );
}

export function Panel({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  const Comp = onClick ? "button" : "div";
  return (
    <Comp
      onClick={onClick}
      className={cn(
        "rounded-[22px] bg-surface p-4 text-left shadow-[var(--shadow-border)]",
        className,
      )}
    >
      {children}
    </Comp>
  );
}

export function MoreMenu({ onGo }: { onGo: (id: ScreenId) => void }) {
  const lang = useGame((s) => s.settings.lang);
  const items: { id: ScreenId; key: string; icon: typeof Home }[] = [
    { id: "modes", key: "modes", icon: Compass },
    { id: "spin", key: "spin", icon: Sparkles },
    { id: "stats", key: "stats", icon: BookOpen },
    { id: "achievements", key: "achievements", icon: Sparkles },
    { id: "profile", key: "profile", icon: Home },
    { id: "settings", key: "settings", icon: MoreHorizontal },
  ];
  return (
    <div className="grid grid-cols-2 gap-2 p-4">
      {items.map((it) => {
        const Icon = it.icon;
        return (
          <button
            key={it.id}
            onClick={() => onGo(it.id)}
            className="flex min-h-16 items-center gap-3 rounded-2xl bg-surface px-4 text-left shadow-[var(--shadow-border)]"
          >
            <Icon className="size-4 text-muted" />
            <span className="text-sm font-medium">{t(lang, it.key)}</span>
          </button>
        );
      })}
    </div>
  );
}
