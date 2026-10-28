/**
 * Site-wide motion: smooth scroll, page-transition curtain (exit half — the
 * entry half is inline in BaseLayout so it runs before anything else),
 * scroll reveals and magnetic buttons.
 */
import Lenis from 'lenis';

const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// ---------- smooth scroll ----------
const lenis = reduce ? null : new Lenis({ lerp: 0.085, autoRaf: true });

// ---------- page transitions ----------
const curtain = document.getElementById('curtain');
const curtainLabel = curtain?.querySelector('span');

document.addEventListener(
  'click',
  (e) => {
    const a = (e.target as Element | null)?.closest?.('a[href]') as HTMLAnchorElement | null;
    if (!a || e.defaultPrevented) return;
    // "#" links are buttons in disguise (e.g. map zoom controls), and widgets can opt out
    if (a.getAttribute('href') === '#' || a.closest('[data-no-curtain]')) return;
    if (a.target === '_blank' || a.hasAttribute('download') || e.button !== 0) return;
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin) return;

    // Same-page anchor → smooth scroll.
    if (url.pathname === location.pathname && url.hash) {
      const target = document.querySelector(url.hash);
      if (target) {
        e.preventDefault();
        // honour scroll-margin-top (set by QuickJump) so sticky bars don't cover the heading
        const offset = -(parseFloat(getComputedStyle(target).scrollMarginTop) || 0);
        lenis ? lenis.scrollTo(target as HTMLElement, { offset }) : target.scrollIntoView();
      }
      return;
    }
    if (reduce || !curtain) return;

    e.preventDefault();
    const label = a.dataset.label ?? '';
    try {
      sessionStorage.setItem('cg-next', label);
    } catch {}
    if (curtainLabel) curtainLabel.textContent = label;
    curtain.style.transition = 'none';
    curtain.style.transform = 'translateY(101%)';
    void curtain.offsetHeight;
    curtain.style.transition = 'transform .75s var(--ease-curtain)';
    curtain.style.transform = 'translateY(0)';
    setTimeout(() => (window.location.href = url.href), 760);
  },
  true,
);

// ---------- reveals ----------
const loadedAt = performance.now();
const io = new IntersectionObserver(
  (entries) =>
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const el = (en.target as HTMLElement & { __reveal?: HTMLElement }).__reveal ?? en.target;
      el.classList.add('is-in');
      io.unobserve(en.target);
      el.querySelectorAll<HTMLElement>('.stat__value').forEach(countUp);
    }),
  { threshold: 0.12, rootMargin: '0px 0px -6% 0px' },
);

document.querySelectorAll<HTMLElement>('[data-reveal]').forEach((el) => {
  if (reduce) return el.classList.add('is-in');
  // Items visible on first load wait for the curtain to lift.
  const delay = Number(el.dataset.delay ?? 0) + (performance.now() - loadedAt < 1500 ? 450 : 0);
  el.style.setProperty('--d', `${delay}ms`);
  // Lines and wipes start fully clipped, and a clipped element never counts as
  // visible to the observer, so watch the parent instead.
  if ((el.dataset.reveal === 'line' || el.dataset.reveal === 'wipe') && el.parentElement) {
    (el.parentElement as HTMLElement & { __reveal?: HTMLElement }).__reveal = el;
    io.observe(el.parentElement);
  } else {
    io.observe(el);
  }
});

// ---------- stat count-up ----------
// The markup holds the final value, so without JS (or with reduced motion) it
// just reads correctly. Only the leading number animates; prefixes and
// suffixes ($, +, K+, %, h) stay put. Ranges like "7–8h" are left alone.
function countUp(el: HTMLElement) {
  const m = /^(\D*?)(\d+(?:\.\d+)?)(\D*)$/.exec(el.textContent ?? '');
  if (reduce || !m || el.dataset.counted) return;
  el.dataset.counted = '1';
  const [, pre, num, post] = m;
  const end = parseFloat(num);
  const dp = num.split('.')[1]?.length ?? 0;
  const delay = parseFloat(getComputedStyle(el.closest('[data-reveal]') ?? el).transitionDelay) * 1000 || 0;
  const dur = 1400;
  let t0 = 0;
  const tick = (t: number) => {
    t0 ||= t;
    const k = Math.min(1, (t - t0) / dur);
    const e = 1 - Math.pow(1 - k, 4);
    el.textContent = pre + (end * e).toFixed(dp) + post;
    if (k < 1) requestAnimationFrame(tick);
  };
  el.textContent = pre + (0).toFixed(dp) + post;
  setTimeout(() => requestAnimationFrame(tick), delay);
}

// ---------- magnetic buttons ----------
if (!reduce && finePointer) {
  const mags = Array.from(document.querySelectorAll<HTMLElement>('[data-magnetic]'));
  const active = new WeakSet<HTMLElement>();
  window.addEventListener(
    'pointermove',
    (e) => {
      if (e.pointerType !== 'mouse') return;
      for (const m of mags) {
        const r = m.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        if (Math.hypot(dx, dy) < Math.max(r.width, r.height) / 2 + 70) {
          m.style.transform = `translate(${dx * 0.32}px, ${dy * 0.32}px)`;
          active.add(m);
        } else if (active.has(m)) {
          m.style.transform = '';
          active.delete(m);
        }
      }
    },
    { passive: true },
  );
}
