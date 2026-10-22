/**
 * Home hero particle field. Particles spring between four target shapes:
 * 0 = your name, 1 = normal-distribution histogram, 2 = k-means clusters, 3 = rotating sphere.
 */

const CYCLE_MS = 5200;
const SPRING = 0.017;
const DAMPING = 0.87;
const REPEL_RADIUS = 110;

interface Field {
  W: number;
  H: number;
  dpr: number;
  N: number;
  x: Float32Array;
  y: Float32Array;
  vx: Float32Array;
  vy: Float32Array;
  /** sphere coordinates */
  sx: Float32Array;
  sy: Float32Array;
  sz: Float32Array;
  fast: Int32Array;
  targets: (Float32Array | null)[];
}

export function initHeroField(section: HTMLElement) {
  const canvas = section.querySelector('canvas')!;
  const ctx = canvas.getContext('2d')!;
  const figN = section.querySelector<HTMLElement>('[data-fig-n]');
  const figLabel = section.querySelector<HTMLElement>('[data-fig-label]');
  const labels: string[] = JSON.parse(section.dataset.labels ?? '[]');
  const first = section.dataset.first ?? '';
  const last = section.dataset.last ?? '';
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let f: Field | null = null;
  let shape = 0;
  let mx = -1e4;
  let my = -1e4;
  let onScreen = true;
  let t = 0;
  let lastTs = 0;
  let cycle = 0;

  const setShape = (i: number) => {
    shape = i % 4;
    if (figN) figN.textContent = String(shape + 1).padStart(2, '0');
    if (figLabel) figLabel.textContent = labels[shape] ?? '';
  };
  const startCycle = () => {
    clearInterval(cycle);
    if (!reduce) cycle = window.setInterval(() => onScreen && !document.hidden && setShape(shape + 1), CYCLE_MS);
  };

  // ---------- target shapes ----------
  function textPts(W: number, H: number, N: number) {
    const o = document.createElement('canvas');
    o.width = Math.ceil(W);
    o.height = Math.ceil(H);
    const g = o.getContext('2d', { willReadFrequently: true })!;
    const fam = '"Instrument Serif", Georgia, serif';
    g.fillStyle = '#fff';
    const set = (fs: number, italic: boolean) => (g.font = `${italic ? 'italic ' : ''}400 ${fs}px ${fam}`);
    if (W < 760) {
      let fs = Math.min(W * 0.34, H * 0.2);
      set(fs, true);
      const w = g.measureText(last).width;
      if (w > W * 0.9) fs *= (W * 0.9) / w;
      const by = H * 0.36 + fs * 0.35;
      set(fs, false);
      g.fillText(first, (W - g.measureText(first).width) / 2, by);
      set(fs, true);
      g.fillText(last, (W - g.measureText(last).width) / 2, by + fs * 0.88);
    } else {
      let fs = Math.min(H * 0.3, W * 0.17);
      const meas = () => {
        set(fs, false);
        const a = g.measureText(first + ' ').width;
        set(fs, true);
        return [a, g.measureText(last).width];
      };
      let [a, b] = meas();
      if (a + b > W * 0.9) {
        fs *= (W * 0.9) / (a + b);
        [a, b] = meas();
      }
      const x0 = (W - a - b) / 2;
      const by = H * 0.47 + fs * 0.3;
      set(fs, false);
      g.fillText(first + ' ', x0, by);
      set(fs, true);
      g.fillText(last, x0 + a, by);
    }
    const d = g.getImageData(0, 0, o.width, o.height).data;
    const A: number[] = [];
    for (let y = 0; y < o.height; y += 2)
      for (let x = 0; x < o.width; x += 2) if (d[(y * o.width + x) * 4 + 3] > 140) A.push(x, y);
    const out = new Float32Array(N * 2);
    const M = A.length / 2;
    for (let i = 0; i < N; i++) {
      if (!M) {
        out[2 * i] = Math.random() * W;
        out[2 * i + 1] = Math.random() * H;
        continue;
      }
      const k = Math.floor(Math.random() * M);
      out[2 * i] = A[2 * k] + Math.random() * 1.6;
      out[2 * i + 1] = A[2 * k + 1] + Math.random() * 1.6;
    }
    return out;
  }

  function histPts(W: number, H: number, N: number) {
    const B = W < 760 ? 11 : 17;
    const x0 = W * 0.14, x1 = W * 0.86, base = H * 0.66, mh = H * 0.4, bw = (x1 - x0) / B;
    const hs: number[] = [], cum: number[] = [];
    let tot = 0;
    for (let b = 0; b < B; b++) {
      const z = (b - (B - 1) / 2) / (B / 6);
      const v = Math.exp((-z * z) / 2) * 0.92 + 0.06;
      hs.push(v);
      tot += v;
      cum.push(tot);
    }
    const out = new Float32Array(N * 2);
    for (let i = 0; i < N; i++) {
      const r = Math.random() * tot;
      let b = 0;
      while (cum[b] < r) b++;
      out[2 * i] = x0 + b * bw + bw * 0.14 + Math.random() * bw * 0.72;
      out[2 * i + 1] = base - Math.random() * hs[b] * mh;
    }
    return out;
  }

  function clusterPts(W: number, H: number, N: number) {
    const s = Math.min(W, H) * 0.075;
    const C = W < 760 ? [[0.35, 0.3], [0.65, 0.46], [0.4, 0.62]] : [[0.3, 0.38], [0.55, 0.62], [0.72, 0.32]];
    const out = new Float32Array(N * 2);
    for (let i = 0; i < N; i++) {
      const c = C[i % 3];
      const u = Math.random() || 1e-6, v = Math.random(), m = Math.sqrt(-2 * Math.log(u));
      out[2 * i] = c[0] * W + m * Math.cos(2 * Math.PI * v) * s * (i % 3 === 1 ? 1.3 : 1);
      out[2 * i + 1] = c[1] * H + m * Math.sin(2 * Math.PI * v) * s;
    }
    return out;
  }

  // ---------- sizing ----------
  function resize() {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const W = r.width || 1200, H = r.height || 800;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    const N = Math.round(Math.min(3600, Math.max(1100, (W * H) / 230)));
    if (!f || f.N !== N) {
      const ga = Math.PI * (3 - Math.sqrt(5));
      const nf: Field = {
        W, H, dpr, N,
        x: new Float32Array(N), y: new Float32Array(N), vx: new Float32Array(N), vy: new Float32Array(N),
        sx: new Float32Array(N), sy: new Float32Array(N), sz: new Float32Array(N), fast: new Int32Array(N),
        targets: [],
      };
      for (let i = 0; i < N; i++) {
        nf.x[i] = Math.random() * W;
        nf.y[i] = Math.random() * H;
        const a = i * ga;
        if (i % 4 === 0) {
          // equatorial ring
          nf.sx[i] = Math.cos(a) * 1.7;
          nf.sy[i] = (Math.random() - 0.5) * 0.04;
          nf.sz[i] = Math.sin(a) * 1.7;
        } else {
          // Fibonacci sphere
          const yy = 1 - (2 * (i + 0.5)) / N, rr = Math.sqrt(1 - yy * yy);
          nf.sx[i] = Math.cos(a) * rr;
          nf.sy[i] = yy;
          nf.sz[i] = Math.sin(a) * rr;
        }
      }
      f = nf;
    }
    Object.assign(f, { W, H, dpr });
    f.targets = [textPts(W, H, N), histPts(W, H, N), clusterPts(W, H, N), null];
  }

  // ---------- frame ----------
  function frame(ts: number) {
    const dt = Math.min(0.033, (ts - (lastTs || ts)) / 1000);
    lastTs = ts;
    requestAnimationFrame(frame);
    if (!f || !onScreen) return;
    t += dt;
    const { W, H, N } = f;
    const T = f.targets[shape];
    ctx.setTransform(f.dpr, 0, 0, f.dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const R2 = REPEL_RADIUS * REPEL_RADIUS, Rs = Math.min(W, H) * 0.25;
    const a = t * 0.32, ca = Math.cos(a), sa = Math.sin(a), cb = Math.cos(0.42), sb = Math.sin(0.42);
    ctx.fillStyle = 'rgba(238,233,224,.82)';
    let nf = 0;
    for (let i = 0; i < N; i++) {
      let tx: number, ty: number;
      if (!T) {
        const x1 = f.sx[i] * ca + f.sz[i] * sa, z1 = -f.sx[i] * sa + f.sz[i] * ca, y2 = f.sy[i] * cb - z1 * sb;
        tx = W / 2 + x1 * Rs;
        ty = H * 0.47 + y2 * Rs;
      } else {
        tx = T[2 * i];
        ty = T[2 * i + 1];
      }
      tx += Math.sin(t * 0.9 + i * 0.37) * 1.4;
      ty += Math.cos(t * 0.7 + i * 0.53) * 1.4;
      let vx = f.vx[i] + (tx - f.x[i]) * SPRING, vy = f.vy[i] + (ty - f.y[i]) * SPRING;
      const dx = f.x[i] - mx, dy = f.y[i] - my, d2 = dx * dx + dy * dy;
      if (d2 < R2) {
        const d = Math.sqrt(d2) || 1, k = (1 - d / REPEL_RADIUS) * 2.6;
        vx += (dx / d) * k;
        vy += (dy / d) * k;
      }
      vx *= DAMPING;
      vy *= DAMPING;
      f.x[i] += vx;
      f.y[i] += vy;
      f.vx[i] = vx;
      f.vy[i] = vy;
      if (vx * vx + vy * vy > 1.8 || i % 11 === 0) f.fast[nf++] = i;
      else ctx.fillRect(f.x[i], f.y[i], 1.5, 1.5);
    }
    ctx.globalCompositeOperation = 'lighter';
    ctx.fillStyle = '#FF4D00';
    for (let j = 0; j < nf; j++) {
      const i = f.fast[j];
      ctx.fillRect(f.x[i] - 0.4, f.y[i] - 0.4, 2.3, 2.3);
    }
    ctx.globalCompositeOperation = 'source-over';
  }

  // ---------- events ----------
  section.addEventListener('pointermove', (e) => {
    const r = section.getBoundingClientRect();
    mx = e.clientX - r.left;
    my = e.clientY - r.top;
  });
  section.addEventListener('pointerleave', () => (mx = my = -1e4));
  section.addEventListener('click', (e) => {
    if ((e.target as Element).closest('a')) return;
    setShape(shape + 1);
    startCycle();
  });
  new IntersectionObserver(([en]) => (onScreen = en.isIntersecting)).observe(section);
  let rt = 0;
  new ResizeObserver(() => {
    clearTimeout(rt);
    rt = window.setTimeout(resize, 120);
  }).observe(section);

  resize();
  // Re-sample the name once the serif font has loaded.
  document.fonts
    ?.load(`400 100px "Instrument Serif"`)
    .then(() => document.fonts.load(`italic 400 100px "Instrument Serif"`))
    .catch(() => {})
    .then(resize);

  setShape(0);
  startCycle();
  requestAnimationFrame(frame);
}
