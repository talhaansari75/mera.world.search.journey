type Bus = "master" | "sfx" | "music";

class GameAudio {
  private ctx: AudioContext | null = null;
  private gains: Partial<Record<Bus, GainNode>> = {};
  private musicTimer: number | null = null;
  private musicOn = false;
  vols = { master: 0.7, sfx: 0.8, music: 0.25 };

  unlock() {
    if (typeof window === "undefined") return;
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    if (!this.ctx) {
      this.ctx = new AC({ latencyHint: "interactive" });
      const master = this.ctx.createGain();
      const sfx = this.ctx.createGain();
      const music = this.ctx.createGain();
      sfx.connect(master);
      music.connect(master);
      master.connect(this.ctx.destination);
      this.gains.master = master;
      this.gains.sfx = sfx;
      this.gains.music = music;
      this.applyVols();
    }
    if (this.ctx.state === "suspended") void this.ctx.resume();
  }

  setVol(bus: Bus, v: number) {
    this.vols[bus] = v;
    this.applyVols();
  }

  private applyVols() {
    const now = this.ctx?.currentTime ?? 0;
    const curve = (x: number) => x * x;
    this.gains.master?.gain.setTargetAtTime(curve(this.vols.master), now, 0.03);
    this.gains.sfx?.gain.setTargetAtTime(curve(this.vols.sfx), now, 0.03);
    this.gains.music?.gain.setTargetAtTime(curve(this.vols.music), now, 0.03);
  }

  private tone(
    freq: number,
    dur: number,
    type: OscillatorType = "sine",
    gain = 0.08,
    bus: Bus = "sfx",
    slide?: number,
  ) {
    if (!this.ctx || !this.gains[bus]) return;
    const t0 = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slide) osc.frequency.exponentialRampToValueAtTime(Math.max(40, slide), t0 + dur);
    g.gain.setValueAtTime(0.0001, t0);
    g.gain.exponentialRampToValueAtTime(gain, t0 + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.gains[bus]!);
    osc.start(t0);
    osc.stop(t0 + dur + 0.02);
    osc.onended = () => {
      osc.disconnect();
      g.disconnect();
    };
  }

  click() {
    this.tone(720 + Math.random() * 40, 0.05, "triangle", 0.04);
  }

  select() {
    this.tone(420 + Math.random() * 80, 0.06, "sine", 0.035);
  }

  found() {
    this.tone(523, 0.12, "triangle", 0.07);
    this.tone(784, 0.16, "sine", 0.05);
  }

  error() {
    this.tone(180, 0.14, "square", 0.04, "sfx", 110);
  }

  win() {
    const notes = [523, 659, 784, 1046];
    notes.forEach((n, i) => {
      setTimeout(() => this.tone(n, 0.22, "triangle", 0.06), i * 90);
    });
  }

  coin() {
    this.tone(980, 0.08, "square", 0.035);
    this.tone(1320, 0.12, "sine", 0.03);
  }

  hint() {
    this.tone(640, 0.1, "sine", 0.04, "sfx", 420);
  }

  startMusic() {
    this.unlock();
    this.musicOn = true;
    this.tickMusic();
  }

  stopMusic() {
    this.musicOn = false;
    if (this.musicTimer != null) window.clearTimeout(this.musicTimer);
    this.musicTimer = null;
  }

  private tickMusic() {
    if (!this.musicOn || !this.ctx) return;
    const scale = [196, 233, 262, 311, 349];
    const n = scale[Math.floor(Math.random() * scale.length)]!;
    this.tone(n, 1.6, "sine", 0.03, "music");
    this.tone(n * 2, 1.4, "triangle", 0.012, "music");
    this.musicTimer = window.setTimeout(() => this.tickMusic(), 1800 + Math.random() * 600);
  }
}

export const audio = new GameAudio();
