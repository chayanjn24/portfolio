/**
 * Row Runner — jump the bad rows, collect the clean ones.
 * Copy (labels, ranks) comes from content/home.ts via the element's data-config.
 */

interface Config {
  badRows: string[];
  ranks: { min: number; title: string }[];
  startLabel: string;
  rerunLabel: string;
}

const BEST_KEY = 'chayan-runner-best';
const GRAVITY = 2600;
const JUMP = 860;
const DOUBLE_JUMP = 760;
const SPEED_START = 380;
const SPEED_MAX = 880;
const SIZE = 30;
const ACCENT = '#FF4D00';

type Box = { x: number; w: number; h: number; b: number; lab?: string };
type Particle = { x: number; y: number; vx: number; vy: number; l: number };

const newGame = () => ({
  t: 0,
  speed: SPEED_START,
  dist: 0,
  rows: 0,
  obs: [] as Box[],
  items: [] as Box[],
  parts: [] as Particle[],
  p: { y: 0, vy: 0, j: 0 },
  nextObs: 1.2,
  nextItem: 0.7,
});

export function initRowRunner(root: HTMLElement) {
  const cfg: Config = JSON.parse(root.dataset.config ?? '{}');
  const stage = root.querySelector<HTMLElement>('[data-stage]')!;
  const canvas = stage.querySelector('canvas')!;
  const ctx = canvas.getContext('2d')!;
  const overlay = root.querySelector<HTMLElement>('[data-overlay]')!;
  const idleEl = root.querySelector<HTMLElement>('[data-idle]')!;
  const overEl = root.querySelector<HTMLElement>('[data-over]')!;
  const startBtn = root.querySelector<HTMLElement>('[data-start]')!;
  const out = (k: string) => root.querySelector<HTMLElement>(`[data-out="${k}"]`)!;

  let phase: 'idle' | 'run' | 'over' = 'idle';
  let g = newGame();
  let W = 800, H = 400, dpr = 1;
  let hover = false;
  let lastTs = 0;
  let best = 0;
  try {
    best = Number(localStorage.getItem(BEST_KEY)) || 0;
  } catch {}
  const showBest = () => root.querySelectorAll<HTMLElement>('[data-best]').forEach((el) => (el.textContent = String(best)));
  showBest();

  const rankFor = (score: number) =>
    [...cfg.ranks].sort((a, b) => b.min - a.min).find((r) => score >= r.min)?.title ?? '';
  const score = () => Math.floor(g.dist / 20) + g.rows * 25;

  function resize() {
    const r = canvas.getBoundingClientRect();
    dpr = Math.min(2, window.devicePixelRatio || 1);
    W = r.width || 800;
    H = r.height || 400;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
  }

  function start() {
    g = newGame();
    phase = 'run';
    overlay.hidden = true;
  }
  function jump() {
    const p = g.p;
    if (p.j < 2) {
      p.vy = p.j ? DOUBLE_JUMP : JUMP;
      p.j++;
    }
  }
  function end() {
    phase = 'over';
    const s = score();
    best = Math.max(best, s);
    try {
      localStorage.setItem(BEST_KEY, String(best));
    } catch {}
    showBest();
    out('rows').textContent = String(g.rows);
    out('dist').textContent = String(Math.round(g.dist / 10));
    out('score').textContent = String(s);
    out('rank').textContent = rankFor(s);
    idleEl.hidden = true;
    overEl.hidden = false;
    startBtn.textContent = cfg.rerunLabel;
    overlay.hidden = false;
  }

  function update(dt: number) {
    const p = g.p, PX = Math.max(48, W * 0.12);
    g.t += dt;
    g.speed = Math.min(SPEED_MAX, SPEED_START + g.t * 13);
    const v = g.speed * dt;
    g.dist += v;
    p.vy -= GRAVITY * dt;
    p.y += p.vy * dt;
    if (p.y <= 0) {
      p.y = 0;
      p.vy = 0;
      p.j = 0;
    }
    g.nextObs -= dt;
    if (g.nextObs <= 0) {
      const fly = g.t > 5 && Math.random() < 0.28;
      const lab = cfg.badRows[Math.floor(Math.random() * cfg.badRows.length)] ?? 'NULL';
      g.obs.push({ x: W + 20, w: Math.max(40, lab.length * 9 + 16), h: fly ? 28 : 38 + Math.random() * 30, b: fly ? 70 : 0, lab });
      g.nextObs = (0.75 + Math.random() * 0.85) * Math.max(0.6, 1 - g.t / 150);
    }
    g.nextItem -= dt;
    if (g.nextItem <= 0) {
      g.items.push({ x: W + 20, w: 56, h: 18, b: 24 + Math.random() * 120 });
      g.nextItem = 0.5 + Math.random() * 0.9;
    }
    g.obs.forEach((o) => (o.x -= v));
    g.obs = g.obs.filter((o) => o.x + o.w > -10);
    g.items.forEach((o) => (o.x -= v));
    const hit = (o: Box) => PX + 5 < o.x + o.w && PX + SIZE - 5 > o.x && p.y + 4 < o.b + o.h && p.y + SIZE - 4 > o.b;
    g.items = g.items.filter((o) => {
      if (o.x + o.w < -10) return false;
      if (hit(o)) {
        g.rows++;
        for (let i = 0; i < 14; i++)
          g.parts.push({ x: o.x + o.w / 2, y: o.b + 9, vx: (Math.random() - 0.5) * 320, vy: Math.random() * 320, l: 0.6 });
        return false;
      }
      return true;
    });
    g.parts.forEach((q) => {
      q.x += q.vx * dt - v * 0.5;
      q.y += q.vy * dt;
      q.vy -= 900 * dt;
      q.l -= dt;
    });
    g.parts = g.parts.filter((q) => q.l > 0);
    if (g.obs.some(hit)) end();
  }

  function draw() {
    const r = canvas.getBoundingClientRect();
    if (r.bottom < 0 || r.top > window.innerHeight) return;
    const G = H - 56, p = g.p, PX = Math.max(48, W * 0.12);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#0B0A09';
    ctx.fillRect(0, 0, W, H);
    // parallax dot grid + ground
    ctx.fillStyle = '#26231F';
    for (let x = -((g.dist * 0.25) % 40); x < W; x += 40) for (let y = G - 20; y > 0; y -= 40) ctx.fillRect(x, y, 1.5, 1.5);
    ctx.fillStyle = '#3A3631';
    ctx.fillRect(0, G, W, 1);
    ctx.fillStyle = '#2A2724';
    for (let x = -(g.dist % 40); x < W; x += 40) ctx.fillRect(x, G + 18, 14, 1);
    // clean rows
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.shadowColor = ACCENT;
    ctx.shadowBlur = 18;
    ctx.fillStyle = ACCENT;
    g.items.forEach((o) => ctx.fillRect(o.x, G - o.b - o.h, o.w, o.h));
    ctx.shadowBlur = 0;
    ctx.font = '500 10px "JetBrains Mono", monospace';
    ctx.fillStyle = '#0B0A09';
    g.items.forEach((o) => ctx.fillText('✓ ROW', o.x + o.w / 2, G - o.b - o.h / 2 + 1));
    // bad rows
    ctx.lineWidth = 1;
    ctx.strokeStyle = '#8C867C';
    ctx.font = '500 12px "JetBrains Mono", monospace';
    g.obs.forEach((o) => {
      const y = G - o.b - o.h;
      ctx.fillStyle = '#15130F';
      ctx.fillRect(o.x, y, o.w, o.h);
      ctx.strokeRect(o.x + 0.5, y + 0.5, o.w - 1, o.h - 1);
      ctx.fillStyle = '#EEE9E0';
      ctx.fillText(o.lab ?? '', o.x + o.w / 2, y + o.h / 2 + 1);
    });
    // particles
    ctx.globalCompositeOperation = 'lighter';
    g.parts.forEach((q) => {
      ctx.globalAlpha = Math.max(0, q.l * 1.6);
      ctx.fillStyle = ACCENT;
      ctx.fillRect(q.x, G - q.y, 3, 3);
    });
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
    // player
    ctx.save();
    ctx.translate(PX + SIZE / 2, G - p.y - SIZE / 2);
    if (p.y > 0) ctx.rotate(-p.vy / 5000);
    ctx.shadowColor = 'rgba(238,233,224,.5)';
    ctx.shadowBlur = 14;
    ctx.fillStyle = '#EEE9E0';
    ctx.fillRect(-SIZE / 2, -SIZE / 2, SIZE, SIZE);
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#0B0A09';
    ctx.fillRect(2, -7, 4, 7);
    ctx.fillRect(9, -7, 4, 7);
    ctx.restore();
    // HUD
    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.font = '500 11px "JetBrains Mono", monospace';
    ctx.fillStyle = '#EEE9E0';
    ctx.fillText('SCORE ' + score(), 18, 30);
    ctx.fillStyle = ACCENT;
    ctx.fillText('CLEAN ROWS ' + g.rows, 18, 48);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#8C867C';
    ctx.fillText('BEST ' + best, W - 18, 30);
  }

  function loop(ts: number) {
    const dt = Math.min(0.033, (ts - (lastTs || ts)) / 1000);
    lastTs = ts;
    if (phase === 'run') update(dt);
    draw();
    requestAnimationFrame(loop);
  }

  stage.addEventListener('pointerdown', () => (phase === 'run' ? jump() : start()));
  stage.addEventListener('pointerenter', () => (hover = true));
  stage.addEventListener('pointerleave', () => (hover = false));
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
  new ResizeObserver(resize).observe(canvas);

  resize();
  requestAnimationFrame(loop);
}
