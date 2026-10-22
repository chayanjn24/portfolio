/**
 * Home hero particle field. Particles spring between target shapes, in order:
 * name, normal-distribution histogram, k-means clusters, pipeline DAG, clean table, funnel, rotating sphere.
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
  // Dot colours come from the theme: pale dots + additive orange on dark, ink dots on paper.
  let dotCol = 'rgba(238,233,224,.82)';
  let hotCol = '#FF4D00';
  let hotOp: GlobalCompositeOperation = 'lighter';
  // Ink on paper reads thinner than light on dark, so dots are a touch bigger in light mode.
  let dot = 1.5;
  let hot = 2.3;
  const readColours = () => {
    const cs = getComputedStyle(document.documentElement);
    const light = document.documentElement.dataset.theme === 'light';
    dotCol = light ? 'rgba(20,18,16,.78)' : 'rgba(238,233,224,.82)';
    hotCol = cs.getPropertyValue('--accent').trim() || '#FF4D00';
    hotOp = light ? 'source-over' : 'lighter';
    dot = light ? 2 : 1.5;
    hot = light ? 2.8 : 2.3;
  };
  readColours();
  window.addEventListener('themechange', readColours);
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  let f: Field | null = null;
  let shape = 0;
  let mx = -1e4;
  let my = -1e4;
  // The now-playing card in the nav talks to the field: it parts the dots while open and sends a ripple on first hover.
  let ex = -1e4;
  let ey = -1e4;
  let er = 0;
  let wave: { x: number; y: number; r: number; s: number } | null = null;
  let onScreen = true;
  let t = 0;
  let lastTs = 0;
  let cycle = 0;

  const setShape = (i: number) => {
    shape = i % (f?.targets.length || labels.length || 1);
    if (figN) figN.textContent = String(shape + 1).padStart(2, '0');
    if (figLabel) figLabel.textContent = labels[shape] ?? '';
  };
  const startCycle = () => {
    clearInterval(cycle);
    if (!reduce) cycle = window.setInterval(() => onScreen && !document.hidden && setShape(shape + 1), CYCLE_MS);
  };

  // ---------- target shapes ----------
  /** Draws onto an offscreen canvas, then scatters N points over the opaque pixels. */
  function samplePts(W: number, H: number, N: number, draw: (g: CanvasRenderingContext2D) => void) {
    const o = document.createElement('canvas');
    o.width = Math.ceil(W);
    o.height = Math.ceil(H);
    const g = o.getContext('2d', { willReadFrequently: true })!;
    g.fillStyle = g.strokeStyle = '#fff';
    draw(g);
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

  function textPts(W: number, H: number, N: number) {
    return samplePts(W, H, N, (g) => {
      const fam = '"Instrument Serif", Georgia, serif';
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
    });
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

  // Analyst diagrams: drawn as strokes, so the dots trace crisp outlines.
  function pipelinePts(W: number, H: number, N: number) {
    return samplePts(W, H, N, (g) => {
      const narrow = W < 760;
      const n = 4, lw = narrow ? 3 : 4;
      g.lineWidth = lw;
      g.lineCap = g.lineJoin = 'round';
      // Phones stack the stages top-to-bottom; wider screens run left-to-right.
      const nw = narrow ? W * 0.42 : Math.min(W * 0.13, 190), nh = narrow ? H * 0.065 : Math.min(H * 0.14, 110);
      const pos = (k: number) =>
        narrow ? [W / 2, H * 0.25 + k * H * 0.115] : [W * 0.14 + (k * W * 0.72) / (n - 1), H * 0.47 + (k % 2 ? -1 : 1) * H * 0.07];
      for (let k = 0; k < n; k++) {
        const [cx, cy] = pos(k);
        g.beginPath();
        g.roundRect(cx - nw / 2, cy - nh / 2, nw, nh, nh * 0.3);
        g.stroke();
        // a little glyph per stage: rows, a funnel tick, a curve, bars
        g.beginPath();
        if (k === 3) for (let b = 0; b < 3; b++) g.rect(cx - nw * 0.22 + b * nw * 0.17, cy + nh * 0.25 - (b + 1) * nh * 0.15, nw * 0.08, (b + 1) * nh * 0.15);
        else if (k === 2) {
          g.moveTo(cx - nw * 0.25, cy + nh * 0.2);
          g.bezierCurveTo(cx - nw * 0.05, cy + nh * 0.2, cx + nw * 0.05, cy - nh * 0.25, cx + nw * 0.25, cy - nh * 0.25);
        } else for (let r = -1; r <= 1; r++) {
          g.moveTo(cx - nw * 0.25, cy + r * nh * 0.2);
          g.lineTo(cx + nw * (k === 1 && r ? 0.1 : 0.25), cy + r * nh * 0.2);
        }
        if (k === 3) g.fill();
        else g.stroke();
        if (k === n - 1) continue;
        const [nx, ny] = pos(k + 1);
        const [ax, ay, bx, by] = narrow
          ? [cx, cy + nh / 2 + lw * 2, nx, ny - nh / 2 - lw * 3]
          : [cx + nw / 2 + lw * 2, cy, nx - nw / 2 - lw * 3, ny];
        const ang = Math.atan2(by - ay, bx - ax), hl = lw * 3.2;
        g.beginPath();
        g.moveTo(ax, ay);
        g.lineTo(bx, by);
        g.moveTo(bx - Math.cos(ang - 0.5) * hl, by - Math.sin(ang - 0.5) * hl);
        g.lineTo(bx, by);
        g.lineTo(bx - Math.cos(ang + 0.5) * hl, by - Math.sin(ang + 0.5) * hl);
        g.stroke();
      }
    });
  }

  function tablePts(W: number, H: number, N: number) {
    return samplePts(W, H, N, (g) => {
      const narrow = W < 760;
      const cols = narrow ? 3 : 5, rows = narrow ? 7 : 6;
      const tw = narrow ? W * 0.8 : Math.min(W * 0.6, 820), th = narrow ? H * 0.36 : H * 0.5;
      const x0 = (W - tw) / 2, y0 = H * (narrow ? 0.2 : 0.22), rh = th / (rows + 1), cw = tw / cols;
      g.lineWidth = narrow ? 2 : 2.5;
      g.strokeRect(x0, y0, tw, th);
      // header row: a heavier rule and bold labels
      g.lineWidth *= 2;
      g.beginPath();
      g.moveTo(x0, y0 + rh);
      g.lineTo(x0 + tw, y0 + rh);
      g.stroke();
      g.lineWidth /= 2;
      for (let c = 0; c < cols; c++) g.fillRect(x0 + c * cw + cw * 0.14, y0 + rh * 0.4, cw * 0.5, Math.max(3, rh * 0.2));
      g.beginPath();
      for (let r = 2; r <= rows; r++) {
        g.moveTo(x0, y0 + r * rh);
        g.lineTo(x0 + tw, y0 + r * rh);
      }
      for (let c = 1; c < cols; c++) {
        g.moveTo(x0 + c * cw, y0);
        g.lineTo(x0 + c * cw, y0 + th);
      }
      g.stroke();
      // the "cleaned" row: a raised outline with a check mark
      const hr = 3;
      g.lineWidth *= 1.6;
      g.beginPath();
      g.roundRect(x0 - 10, y0 + hr * rh - 4, tw + 20, rh + 8, 6);
      g.moveTo(x0 + tw - cw * 0.5, y0 + hr * rh + rh * 0.5);
      g.lineTo(x0 + tw - cw * 0.4, y0 + hr * rh + rh * 0.7);
      g.lineTo(x0 + tw - cw * 0.22, y0 + hr * rh + rh * 0.28);
      g.stroke();
      g.lineWidth /= 1.6;
      // short cell values in the other rows
      for (let r = 1; r <= rows; r++) {
        for (let c = 0; c < (r === hr ? cols - 1 : cols); c++) {
          const len = 0.35 + (((r * 7 + c * 3) % 5) / 5) * 0.4;
          g.fillRect(x0 + c * cw + cw * 0.14, y0 + r * rh + rh * 0.42, cw * len * 0.72, Math.max(2, rh * 0.14));
        }
      }
    });
  }

  function funnelPts(W: number, H: number, N: number) {
    return samplePts(W, H, N, (g) => {
      const narrow = W < 760;
      const steps = 4, top = H * 0.2, sh = H * (narrow ? 0.085 : 0.125), gap = sh * 0.16;
      const w0 = narrow ? W * 0.86 : Math.min(W * 0.5, 720), w1 = w0 * 0.22;
      g.lineWidth = narrow ? 3 : 3.5;
      g.lineJoin = 'round';
      for (let k = 0; k < steps; k++) {
        const ya = top + k * (sh + gap), yb = ya + sh;
        const wa = w0 - ((w0 - w1) * k) / steps, wb = w0 - ((w0 - w1) * (k + 1)) / steps;
        g.beginPath();
        g.moveTo(W / 2 - wa / 2, ya);
        g.lineTo(W / 2 + wa / 2, ya);
        g.lineTo(W / 2 + wb / 2, yb);
        g.lineTo(W / 2 - wb / 2, yb);
        g.closePath();
        // each stage is an outline with a share bar inside, shrinking as users drop off
        g.stroke();
        g.fillRect(W / 2 - wb * 0.32, ya + sh * 0.44, wb * 0.64 * (1 - k * 0.2), Math.max(3, sh * 0.1));
      }
    });
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
    f.targets = [textPts(W, H, N), histPts(W, H, N), clusterPts(W, H, N), pipelinePts(W, H, N), tablePts(W, H, N), funnelPts(W, H, N), null];
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
    ctx.fillStyle = dotCol;
    let nf = 0;
    if (wave) {
      wave.r += 11;
      wave.s *= 0.975;
      if (wave.s < 0.05) wave = null;
    }
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
      if (er) {
        const ax = f.x[i] - ex, ay = f.y[i] - ey, ad = Math.sqrt(ax * ax + ay * ay);
        if (ad < er) {
          const k = (1 - ad / er) * 3.4;
          vx += (ax / (ad || 1)) * k;
          vy += (ay / (ad || 1)) * k;
        }
      }
      if (wave) {
        const wx = f.x[i] - wave.x, wy = f.y[i] - wave.y, wd = Math.sqrt(wx * wx + wy * wy), band = Math.abs(wd - wave.r);
        if (band < 70) {
          const k = (1 - band / 70) * wave.s;
          vx += (wx / (wd || 1)) * k;
          vy += (wy / (wd || 1)) * k;
        }
      }
      vx *= DAMPING;
      vy *= DAMPING;
      f.x[i] += vx;
      f.y[i] += vy;
      f.vx[i] = vx;
      f.vy[i] = vy;
      if (vx * vx + vy * vy > 1.8 || i % 11 === 0) f.fast[nf++] = i;
      else ctx.fillRect(f.x[i], f.y[i], dot, dot);
    }
    ctx.globalCompositeOperation = hotOp;
    ctx.fillStyle = hotCol;
    for (let j = 0; j < nf; j++) {
      const i = f.fast[j];
      ctx.fillRect(f.x[i] - 0.4, f.y[i] - 0.4, hot, hot);
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
  const local = (x: number, y: number) => {
    const r = section.getBoundingClientRect();
    return [x - r.left, y - r.top];
  };
  window.addEventListener('np:open', (e) => {
    const { x, y, w, h, first } = (e as CustomEvent).detail;
    [ex, ey] = local(x, y);
    er = Math.max(w, h) * 0.8;
    if (first && !reduce) wave = { x: ex, y: ey, r: 0, s: 5 };
  });
  window.addEventListener('np:close', () => (er = 0));
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
