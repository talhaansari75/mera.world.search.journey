import { useEffect, useState } from "react";
import { audio } from "@/lib/game/audio";
import { dirFor } from "@/lib/game/i18n";
import {
  CAMPAIGN_COUNT,
  campaignLevel,
  sessionFromLevel,
} from "@/lib/game/levels";
import { useGame } from "@/lib/game/store";
import type { LevelResult, PlaySession, ScreenId } from "@/lib/game/types";
import { BottomNav } from "./chrome";
import { PlayScreen } from "./play-screen";
import {
  AchievementsScreen,
  DailyScreen,
  DictionaryScreen,
  HomeScreen,
  JourneyScreen,
  ModesScreen,
  ProfileScreen,
  ResultScreen,
  SettingsScreen,
  ShopScreen,
  SpinScreen,
  Splash,
  StatsScreen,
} from "./screens";

export function GameApp() {
  const hydrated = useGame((s) => s.hydrated);
  const markHydrated = useGame((s) => s.markHydrated);
  const settings = useGame((s) => s.settings);
  const toast = useGame((s) => s.toast);
  const setToast = useGame((s) => s.setToast);
  const energyNow = useGame((s) => s.energyNow);
  const spendEnergy = useGame((s) => s.spendEnergy);
  const applyResult = useGame((s) => s.applyResult);

  const [booted, setBooted] = useState(false);
  const [screen, setScreen] = useState<ScreenId>("splash");
  const [session, setSession] = useState<PlaySession | null>(null);
  const [result, setResult] = useState<(LevelResult & { marks: string[] }) | null>(null);

  useEffect(() => {
    let alive = true;
    const fallback = window.setTimeout(() => {
      if (alive) markHydrated();
    }, 600);
    void Promise.resolve(useGame.persist.rehydrate()).then(() => {
      if (!alive) return;
      window.clearTimeout(fallback);
      markHydrated();
    });
    return () => {
      alive = false;
      window.clearTimeout(fallback);
    };
  }, [markHydrated]);

  useEffect(() => {
    if (!hydrated) return;
    document.documentElement.dataset.theme = settings.theme;
    document.documentElement.dataset.reduceMotion = settings.reduceMotion ? "on" : "off";
    document.documentElement.lang = settings.lang;
    document.documentElement.dir = dirFor(settings.lang);
    audio.setVol("master", settings.master);
    audio.setVol("sfx", settings.sfx);
    audio.setVol("music", settings.music);
  }, [hydrated, settings]);

  useEffect(() => {
    if (!toast) return;
    const id = window.setTimeout(() => setToast(null), 1800);
    return () => window.clearTimeout(id);
  }, [toast, setToast]);

  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") {
        /* persist already writes on set */
      } else {
        audio.unlock();
      }
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, []);

  const begin = () => {
    audio.unlock();
    if (!useGame.getState().hydrated) return;
    audio.click();
    if (settings.music > 0.02) audio.startMusic();
    energyNow();
    setBooted(true);
    setScreen("home");
  };

  const goPlay = (s: PlaySession) => {
    audio.click();
    energyNow();
    if (s.energyCost > 0 && !spendEnergy(s.energyCost)) {
      setToast("energy");
      setScreen("shop");
      return;
    }
    setSession(s);
    setScreen("play");
  };

  const onResult = (r: LevelResult) => {
    const boss = !!r.session.levelId?.endsWith("-8");
    const legend = !!r.session.levelId?.startsWith("legend");
    const marks = applyResult(r, { boss, legend });
    if (r.coins > 0) audio.coin();
    setResult({ ...r, marks });
    setScreen("result");
  };

  const nextLevel = () => {
    const cur = session;
    setResult(null);
    if (cur?.levelId?.startsWith("w")) {
      const m = /^w(\d+)-(\d+)$/.exec(cur.levelId);
      if (m) {
        const abs = (Number(m[1]) - 1) * 8 + Number(m[2]) + 1;
        if (abs <= CAMPAIGN_COUNT) {
          goPlay(sessionFromLevel(campaignLevel(abs)));
          return;
        }
      }
    }
    setScreen("journey");
  };

  if (!booted || screen === "splash") {
    return <Splash onBegin={begin} ready={hydrated} />;
  }

  const showNav = !["play", "result"].includes(screen);

  const body = (() => {
    switch (screen) {
      case "play":
        return session ? (
          <PlayScreen
            session={session}
            onExit={() => setScreen("home")}
            onResult={onResult}
          />
        ) : null;
      case "result":
        return result ? (
          <ResultScreen
            coins={result.coins}
            xp={result.xp}
            won={result.won}
            perfect={result.perfect}
            elapsed={result.elapsed}
            found={result.found.length}
            total={result.words.length}
            hintsUsed={result.hintsUsed}
            marks={result.marks}
            onNext={nextLevel}
            onHome={() => setScreen("home")}
          />
        ) : null;
      case "journey":
        return <JourneyScreen onPlay={goPlay} onBack={() => setScreen("home")} />;
      case "modes":
        return <ModesScreen onPlay={goPlay} onBack={() => setScreen("home")} />;
      case "daily":
        return <DailyScreen onPlay={goPlay} onBack={() => setScreen("home")} />;
      case "shop":
        return <ShopScreen onBack={() => setScreen("home")} />;
      case "spin":
        return <SpinScreen onBack={() => setScreen("home")} />;
      case "stats":
        return <StatsScreen onBack={() => setScreen("home")} />;
      case "achievements":
        return <AchievementsScreen onBack={() => setScreen("home")} />;
      case "profile":
        return <ProfileScreen onBack={() => setScreen("home")} />;
      case "settings":
        return <SettingsScreen onBack={() => setScreen("home")} />;
      case "dictionary":
        return (
          <DictionaryScreen
            onBack={() => setScreen("home")}
            onMore={(id) => setScreen(id)}
          />
        );
      default:
        return <HomeScreen onPlay={goPlay} onGo={setScreen} />;
    }
  })();

  return (
    <div className="mx-auto flex min-h-dvh max-w-[430px] flex-col bg-bg">
      <div className="flex min-h-0 flex-1 flex-col">{body}</div>
      {showNav && <BottomNav screen={screen} onGo={setScreen} />}
      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-24 z-50 flex justify-center">
          <div className="rounded-full bg-ink px-4 py-2 text-xs text-paper shadow-[var(--shadow-lift)]">
            {toast === "energy" ? "Energy spent" : toast}
          </div>
        </div>
      )}
    </div>
  );
}
