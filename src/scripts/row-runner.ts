/**
 * Row Runner — jump the bad rows, collect the clean ones.
 * Copy (labels, ranks, messages) comes from content/home.ts via the element's data-config.
 *
 * Fairness rules: a grace period at the start, obstacles never closer than one jump allows,
 * no flying error straight after a ground one, and speed scaled to the screen width so a
 * phone isn't harder than a laptop.
 */

interface Config {
  badRows: string[];
  ranks: { min: number; title: string }[];
  startLabel: string;
  rerunLabel: string;
  shieldLabel: string;
  promoted: string;
  shieldOn: string;
  shieldUsed: string;
}

const BEST_KEY = 'chayan-runner-best';
const SOUND_KEY = 'chayan-runner-sound';
const GRAVITY = 2600;
const JUMP = 860;
const DOUBLE_JUMP = 760;
const AIR_TIME = (2 * JUMP) / GRAVITY; // ≈ 0.66 s in the air from one jump
const SPEED_START = 360;
const SPEED_MAX = 820;
const GRACE = 1.6; // seconds before the first obstacle
const SIZE = 30;
const SHIELD_TIME = 6;
// Canvas colours follow the site theme tokens (re-read on 'themechange').
let ACCENT = '#FF4D00';
let SHIELD = '#EEE9E0';
const C = { bg: '#0B0A09', grid: '#26231F', ground: '#3A3631', dash: '#2A2724', box: '#15130F', ink: '#EEE9E0', muted: '#8C867C', glow: 'rgba(238,233,224,.5)', light: false };
function readColours() {
  const cs = getComputedStyle(document.documentElement);
  const v = (k: string, d: string) => cs.getPropertyValue(k).trim() || d;
  C.light = document.documentElement.dataset.theme === 'light';
  C.bg = v('--bg', C.bg);
  C.grid = v(C.light ? '--line' : '--hairline', C.grid);
  C.ground = v('--line-strong', C.ground);
  C.dash = v('--line', C.dash);
  C.box = v('--surface-2', C.box);
  C.ink = v('--text', C.ink);
  C.muted = v('--muted', C.muted);
  C.glow = C.light ? 'rgba(20,18,16,.25)' : 'rgba(238,233,224,.5)';
  ACCENT = v('--accent', ACCENT);
  SHIELD = C.ink;
}

type Box = { x: number; w: number; h: number; b: number; lab?: string; fly?: boolean };
type Particle = { x: number; y: number; vx: number; vy: number; l: number; c: string };

const newGame = () => ({
  t: 0,
  speed: SPEED_START,
  dist: 0,
  rows: 0,
  obs: [] as Box[],
  items: [] as Box[],
  shields: [] as Box[],
  parts: [] as Particle[],
  p: { y: 0, vy: 0, j: 0 },
  nextObs: GRACE,
  nextItem: 0.9,
  nextShield: 14,
  lastWasGround: false,
  shield: 0, // seconds of shield left
  rank: 0, // index of the current rank
  toast: { text: '', t: 0 },
  shake: 0,
});

/** Tiny synthesized sound effects (no files). Muted state is remembered. */
function makeSound() {
  let ctx: AudioContext | null = null;
  let on = true;
  try {
    on = localStorage.getItem(SOUND_KEY) !== 'off';
  } catch {}
  const beep = (freq: number, dur: number, type: OscillatorType = 'square', vol = 0.05, slide = 0) => {
    if (!on) return;
    try {
      ctx ??= new AudioContext();
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = type;
      o.frequency.setValueAtTime(freq, ctx.currentTime);
      if (slide) o.frequency.exponentialRampToValueAtTime(Math.max(40, freq + slide), ctx.currentTime + dur);
      g.gain.setValueAtTime(vol, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + dur);
      o.connect(g).connect(ctx.destination);
      o.start();
      o.stop(ctx.currentTime + dur);
    } catch {}
  };
  return {
    get on() {
      return on;
    },
    toggle() {
      on = !on;
      try {
        localStorage.setItem(SOUND_KEY, on ? 'on' : 'off');
      } catch {}
      return on;
    },
    jump: () => beep(520, 0.09, 'square', 0.035, 260),
    collect: () => {
      beep(880, 0.07, 'triangle', 0.05);
      setTimeout(() => beep(1320, 0.09, 'triangle', 0.04), 60);
    },
    shield: () => [660, 880, 1100].forEach((f, i) => setTimeout(() => beep(f, 0.08, 'triangle', 0.045), i * 70)),
    block: () => beep(300, 0.18, 'sawtooth', 0.04, -150),
    promote: () => [523, 659, 784, 1046].forEach((f, i) => setTimeout(() => beep(f, 0.1, 'triangle', 0.04), i * 90)),
    crash: () => beep(160, 0.35, 'sawtooth', 0.06, -110),
  };
}

export function initRowRunner(root: HTMLElement) {
  const cfg: Config = JSON.parse(root.dataset.config ?? '{}');
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const canvas = stage.querySelector('canvas')!;
  const ctx = canvas.getContext('2d')!;
  const overlay = root.querySelector<HTMLElement>('[data-overlay]')!;
  const idleEl = root.querySelector<HTMLElement>('[data-idle]')!;
  const overEl = root.querySelector<HTMLElement>('[data-over]')!;
  const startBtn = root.querySelector<HTMLElement>('[data-start]')!;
  const muteBtn = root.querySelector<HTMLButtonElement>('[data-mute]');
  const out = (k: string) => root.querySelector<HTMLElement>(`[data-out="${k}"]`)!;
  const sound = makeSound();
  readColours();
  window.addEventListener('themechange', readColours);
  const ranks = [...cfg.ranks].sort((a, b) => a.min - b.min);

  let phase: 'idle' | 'run' | 'over' = 'idle';
  let g = newGame();
  let W = 800, H = 400, dpr = 1;
  let hover = false;
  let lastTs = 0;
  let endedAt = 0;
  let onScreen = true;
  let best = 0;
  try {
    best = Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {}
  const showBest = () => root.querySelectorAll<HTMLElement>('[data-best]').forEach((el) => (el.textContent = String(best)));
  showBest();

  const setMuteLabel = () => {
    if (!muteBtn) return;
    muteBtn.textContent = sound.on ? '🔊 Sound on' : '🔇 Sound off';
    muteBtn.setAttribute('aria-pressed', String(!sound.on));
  };
  setMuteLabel();
  muteBtn?.addEventListener('click', (e) => {
    e.stopPropagation();
    sound.toggle();
    setMuteLabel();
  });
  muteBtn?.addEventListener('pointerdown', (e) => e.stopPropagation());

  const rankIndex = (score: number) => ranks.reduce((idx, r, i) => (score >= r.min ? i : idx), 0);
  const score = () => Math.floor(g.dist / 20) + g.rows * 25;
  // Phones get proportionally slower pixels, so the same reaction time works on every screen.
  const scale = () => Math.min(1, Math.max(0.62, W / 900));
  const toast = (text: string) => (g.toast = { text, t: 1.6 });

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width || 800;
    H = r.height || 400;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
  }

  function start() {
    if (phase === 'over' && performance.now() - endedAt < 450) return; // don't restart from a panicked tap
    g = newGame();
    phase = 'run';
    overlay.hidden = true;
    stage.classList.add('is-running');
  }
  function jump() {
    const p = g.p;
    if (p.j < 2) {
      p.vy = p.j ? DOUBLE_JUMP : JUMP;
      p.j++;
      sound.jump();
    }
  }
  function end() {
    phase = 'over';
    endedAt = performance.now();
    g.shake = 0.35;
    sound.crash();
    const s = score();
    best = Math.max(best, s);
    try {
      localStorage.setItem(BEST_KEY, String(best));
    } catch {}
    showBest();
    out('rows').textContent = String(g.rows);
    out('dist').textContent = String(Math.round(g.dist / 10));
    out('score').textContent = String(s);
    out('rank').textContent = ranks[rankIndex(s)]?.title ?? '';
    idleEl.hidden = true;
    overEl.hidden = false;
    startBtn.textContent = cfg.rerunLabel;
    stage.classList.remove('is-running');
    setTimeout(() => (overlay.hidden = false), 380); // let the crash shake play first
  }

  function spawnObstacle() {
    const k = scale();
    // Flying errors only after 12 s, and never straight after a ground one (you'd be mid-jump).
    const fly = g.t > 12 && !g.lastWasGround && Math.random() < 0.3;
    const lab = cfg.badRows[Math.floor(Math.random() * cfg.badRows.length)] ?? 'NULL';
    const w = Math.max(40, lab.length * 9 + 16);
    const tall = g.t < 10 ? 38 + Math.random() * 12 : 38 + Math.random() * 28; // gentle start
    g.obs.push({ x: W + 20, w, h: fly ? 28 : tall, b: fly ? 70 : 0, lab, fly });
    g.lastWasGround = !fly;
    // The next gap is always long enough to land and jump again.
    const v = g.speed * k;
    const minGap = AIR_TIME + 0.22 + (w + SIZE) / v;
    const easy = Math.max(0, 1 - g.t / 25); // early on, gaps are longer
    g.nextObs = minGap + Math.random() * (0.9 + easy * 0.8) * Math.max(0.55, 1 - g.t / 120);
  }

  function update(dt: number) {
    const p = g.p, PX = Math.max(48, W * 0.12), k = scale();
    g.t += dt;
    // Smooth speed-up: fast at first, flattening out towards the top speed.
    g.speed = SPEED_START + (SPEED_MAX - SPEED_START) * (1 - Math.exp(-g.t / 55));
    const v = g.speed * k * dt;
    g.dist += g.speed * dt;
    p.vy -= GRAVITY * dt;
    p.y += p.vy * dt;
    if (p.y <= 0) {
      p.y = 0;
      p.vy = 0;
      p.j = 0;
    }

    g.nextObs -= dt;
    if (g.nextObs <= 0) spawnObstacle();
    g.nextItem -= dt;
    if (g.nextItem <= 0) {
      // keep rows away from obstacles that are about to arrive, so grabbing one is never a trap
      const near = g.obs.some((o) => o.x > W - 90);
      if (!near) g.items.push({ x: W + 20, w: 56, h: 18, b: 24 + Math.random() * 110 });
      g.nextItem = 0.55 + Math.random() * 0.9;
    }
    g.nextShield -= dt;
    if (g.nextShield <= 0) {
      if (!g.shield) g.shields.push({ x: W + 20, w: 92, h: 22, b: 40 + Math.random() * 60 });
      g.nextShield = 16 + Math.random() * 10;
    }

    for (const list of [g.obs, g.items, g.shields]) list.forEach((o) => (o.x -= v));
    g.obs = g.obs.filter((o) => o.x + o.w > -10);
    const hit = (o: Box) => PX + 5 < o.x + o.w && PX + SIZE - 5 > o.x && p.y + 4 < o.b + o.h && p.y + SIZE - 4 > o.b;
    const burst = (o: Box, c: string, n = 14) => {
      for (let i = 0; i < n; i++)
        g.parts.push({ x: o.x + o.w / 2, y: o.b + o.h / 2, vx: (Math.random() - 0.5) * 340, vy: Math.random() * 340, l: 0.6, c });
    };

    g.items = g.items.filter((o) => {
      if (o.x + o.w < -10) return false;
      if (hit(o)) {
        g.rows++;
        burst(o, ACCENT);
        sound.collect();
        return false;
      }
      return true;
    });
    g.shields = g.shields.filter((o) => {
      if (o.x + o.w < -10) return false;
      if (hit(o)) {
        g.shield = SHIELD_TIME;
        burst(o, SHIELD, 20);
        sound.shield();
        toast(cfg.shieldOn);
        return false;
      }
      return true;
    });
    if (g.shield) g.shield = Math.max(0, g.shield - dt);

    g.parts.forEach((q) => {
      q.x += q.vx * dt - v * 0.5;
      q.y += q.vy * dt;
      q.vy -= 900 * dt;
      q.l -= dt;
    });
    g.parts = g.parts.filter((q) => q.l > 0);
    if (g.toast.t) g.toast.t = Math.max(0, g.toast.t - dt);

    // Promotions: a message each time the score reaches a new rank.
    const r = rankIndex(score());
    if (r > g.rank) {
      g.rank = r;
      toast(cfg.promoted.replace('{rank}', ranks[r].title));
      sound.promote();
    }

    const crashed = g.obs.find(hit);
    if (crashed) {
      if (g.shield) {
        g.shield = 0;
        g.obs = g.obs.filter((o) => o !== crashed);
        burst(crashed, SHIELD, 24);
        g.shake = 0.15;
        sound.block();
        toast(cfg.shieldUsed);
      } else end();
    }
  }

  function draw(dt: number) {
    if (!onScreen) return;
    const G = H - 56, p = g.p, PX = Math.max(48, W * 0.12);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    if (g.shake > 0) {
      g.shake = Math.max(0, g.shake - dt);
      const m = g.shake * 26;
      ctx.translate((Math.random() - 0.5) * m, (Math.random() - 0.5) * m);
    }
    ctx.fillStyle = C.bg;
    ctx.fillRect(-20, -20, W + 40, H + 40);
    // parallax dot grid + ground
    ctx.fillStyle = C.grid;
    for (let x = -((g.dist * 0.25) % 40); x < W; x += 40) for (let y = G - 20; y > 0; y -= 40) ctx.fillRect(x, y, 1.5, 1.5);
    ctx.fillStyle = C.ground;
    ctx.fillRect(0, G, W, 1);
    ctx.fillStyle = C.dash;
    for (let x = -(g.dist % 40); x < W; x += 40) ctx.fillRect(x, G + 18, 14, 1);

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // clean rows
    ctx.shadowColor = ACCENT;
    ctx.shadowBlur = 18;
    ctx.fillStyle = ACCENT;
    g.items.forEach((o) => ctx.fillRect(o.x, G - o.b - o.h, o.w, o.h));
    ctx.shadowBlur = 0;
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.fillStyle = C.bg;
    g.items.forEach((o) => ctx.fillText('✓ ROW', o.x + o.w / 2, G - o.b - o.h / 2 + 1));
    // shield power-ups
    g.shields.forEach((o) => {
      const y = G - o.b - o.h;
      ctx.shadowColor = SHIELD;
      ctx.shadowBlur = 14;
      ctx.strokeStyle = SHIELD;
      ctx.lineWidth = 1.5;
      ctx.strokeRect(o.x + 0.5, y + 0.5, o.w - 1, o.h - 1);
      ctx.shadowBlur = 0;
      ctx.fillStyle = SHIELD;
      ctx.fillText('◆ ' + cfg.shieldLabel, o.x + o.w / 2, y + o.h / 2 + 1);
    });
    // bad rows
    ctx.lineWidth = 1;
    ctx.strokeStyle = C.muted;
    ctx.font = '500 12px "JetBrains Mono", monospace';
    g.obs.forEach((o) => {
      const y = G - o.b - o.h;
      ctx.fillStyle = C.box;
      ctx.fillRect(o.x, y, o.w, o.h);
      ctx.strokeRect(o.x + 0.5, y + 0.5, o.w - 1, o.h - 1);
      ctx.fillStyle = C.ink;
      ctx.fillText(o.lab ?? '', o.x + o.w / 2, y + o.h / 2 + 1);
    });
    // particles
    ctx.globalCompositeOperation = C.light ? 'source-over' : 'lighter';
    g.parts.forEach((q) => {
      ctx.globalAlpha = Math.max(0, q.l * 1.6);
      ctx.fillStyle = q.c;
      ctx.fillRect(q.x, G - q.y, 3, 3);
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    // player
    ctx.save();
    ctx.translate(PX + SIZE / 2, G - p.y - SIZE / 2);
    if (p.y > 0) ctx.rotate(-p.vy / 5000);
    if (g.shield) {
      const blink = g.shield < 1.5 && Math.floor(g.shield * 8) % 2 === 0;
      if (!blink) {
        ctx.strokeStyle = SHIELD;
        ctx.lineWidth = 1.5;
        ctx.shadowColor = SHIELD;
        ctx.shadowBlur = 16;
        ctx.beginPath();
        ctx.arc(0, 0, SIZE * 0.85, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
    ctx.shadowColor = C.glow;
    ctx.shadowBlur = 14;
    ctx.fillStyle = C.ink;
    ctx.fillRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);
    ctx.shadowBlur = 0;
    ctx.fillStyle = C.bg;
    ctx.fillRect(2, -7, 4, 7);
    ctx.fillRect(9, -7, 4, 7);
    ctx.restore();
    // HUD
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillStyle = C.ink;
    ctx.fillText('SCORE ' + score(), 18, 30);
    ctx.fillStyle = ACCENT;
    ctx.fillText('CLEAN ROWS ' + g.rows, 18, 48);
    if (g.shield) {
      ctx.fillStyle = SHIELD;
      ctx.fillText(`◆ ${cfg.shieldLabel} ${Math.ceil(g.shield)}s`, 18, 66);
    }
    ctx.textAlign = 'right';
    ctx.fillStyle = C.muted;
    ctx.fillText('BEST ' + best, W - 18, 30);
    // toast (promotion / shield messages)
    if (g.toast.t > 0 && phase === 'run') {
      const a = Math.min(1, g.toast.t * 2.5);
      ctx.globalAlpha = a;
      ctx.textAlign = 'center';
      ctx.font = `italic 400 ${Math.round(Math.min(34, W / 14))}px "Instrument Serif", serif`;
      ctx.fillStyle = ACCENT;
      ctx.fillText(g.toast.text, W / 2, H * 0.32 - (1.6 - g.toast.t) * 10);
      ctx.globalAlpha = 1;
    }
  }

  function loop(ts: number) {
    const dt = Math.min(0.033, (ts - (lastTs || ts)) / 1000);
    lastTs = ts;
    if (phase === 'run' && onScreen) update(dt);
    draw(dt);
    requestAnimationFrame(loop);
  }

  // Input: tap/click anywhere on the stage. preventDefault stops focus rings, text
  // selection and the double-tap zoom that phones would otherwise do.
  stage.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse') e.preventDefault();
    phase === 'run' ? jump() : start();
  });
  stage.addEventListener('pointerenter', () => (hover = true));
  stage.addEventListener('pointerleave', () => (hover = false));
  stage.addEventListener('contextmenu', (e) => e.preventDefault());
  stage.addEventListener('keydown', (e) => {
    if (phase !== 'run' && (e.code === 'Enter' || e.code === 'Space')) {
      e.preventDefault();
      start();
    }
  });
  window.addEventListener('keydown', (e) => {
    if (e.defaultPrevented) return;
    const isJump = e.code === 'Space' || e.code === 'ArrowUp' || e.code === 'KeyW';
    if (phase === 'run' && isJump) {
      e.preventDefault();
      jump();
    } else if (hover && phase !== 'run' && (isJump || e.code === 'Enter')) {
      e.preventDefault();
      start();
    }
  });
  // Pause the game while it's off screen or the tab is hidden, instead of crashing unseen.
  new IntersectionObserver(([en]) => (onScreen = en.isIntersecting)).observe(stage);
  document.addEventListener('visibilitychange', () => (lastTs = 0));
  new ResizeObserver(resize).observe(canvas);

  resize();
  requestAnimationFrame(loop);
}
