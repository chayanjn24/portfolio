/**
 * Draws a 1200×630 link-preview card (the image LinkedIn/WhatsApp show) as a PNG.
 * Runs only at build time. Layout uses satori (HTML-like boxes → SVG) and resvg (SVG → PNG).
 */
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import satori from 'satori';
import { Resvg } from '@resvg/resvg-js';

export interface Card {
  /** Small uppercase line at the top, e.g. '(01) Analytics product'. */
  label: string;
  /** Big serif title. Supports *emphasis* (orange italic). */
  title: string;
  /** Optional line under the title. */
  sub?: string;
  /** Optional big number + caption (project results). */
  stat?: [string, string];
  /** Optional pill in the top-right, e.g. 'Shipped'. */
  badge?: string;
  /** Domain shown bottom-right. */
  domain: string;
  firstName: string;
  lastName: string;
}

const C = {
  bg: '#0B0A09',
  text: '#EEE9E0',
  text2: '#A8A196',
  muted: '#8C867C',
  line: '#2A2724',
  accent: '#FF4D00',
};

const font = (file: string) => readFileSync(join(process.cwd(), 'node_modules/@fontsource', file));
let fonts: Parameters<typeof satori>[1]['fonts'] | undefined;
const loadFonts = () =>
  (fonts ??= [
    { name: 'Serif', data: font('instrument-serif/files/instrument-serif-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Serif', data: font('instrument-serif/files/instrument-serif-latin-400-italic.woff'), weight: 400, style: 'italic' },
    { name: 'Mono', data: font('jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff'), weight: 400, style: 'normal' },
    { name: 'Mono', data: font('jetbrains-mono/files/jetbrains-mono-latin-500-normal.woff'), weight: 500, style: 'normal' },
  ]);

type Node = { type: string; props: Record<string, unknown> & { style?: Record<string, unknown>; children?: unknown } };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({ type, props: { style, children } });

/** The card fonts are Latin-only; swap symbols they lack so nothing renders as a box. */
const safe = (s: string) => s.replace(/⇄/g, '·').replace(/→/g, '–').replace(/₹/g, 'Rs ');

/** 'Row *Runner*' → spans, with the starred part in orange italic. */
function richSpans(s: string): Node[] {
  return s
    .split(/(\*[^*]+\*)/)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('*')
        ? el('span', { fontStyle: 'italic', color: C.accent, whiteSpace: 'pre' }, part.slice(1, -1))
        : el('span', { whiteSpace: 'pre' }, part),
    );
}

export async function renderCard(card: Card): Promise<Buffer> {
  const plainLength = card.title.replace(/\*/g, '').length;
  const titleSize = plainLength <= 12 ? 168 : plainLength <= 22 ? 124 : plainLength <= 34 ? 96 : 76;

  const tree = el(
    'div',
    {
      width: 1200,
      height: 630,
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      paddingTop: 60,
      paddingRight: 72,
      paddingBottom: 52,
      paddingLeft: 72,
      backgroundColor: C.bg,
      backgroundImage: 'radial-gradient(circle at 92% 110%, rgba(255,77,0,0.34), rgba(11,10,9,0) 55%)',
      color: C.text,
      fontFamily: 'Mono',
    },
    [
      // top row
      el('div', { display: 'flex', justifyContent: 'space-between', alignItems: 'center' }, [
        el('div', { display: 'flex', fontSize: 22, letterSpacing: 2, textTransform: 'uppercase', color: C.muted }, safe(card.label)),
        card.badge
          ? el(
              'div',
              {
                display: 'flex',
                fontSize: 18,
                letterSpacing: 2,
                textTransform: 'uppercase',
                padding: '8px 18px',
                borderRadius: 99,
                border: `1px solid ${C.accent}`,
                color: card.badge === 'Shipped' ? C.bg : C.accent,
                backgroundColor: card.badge === 'Shipped' ? C.accent : 'transparent',
              },
              card.badge,
            )
          : el('div', { display: 'flex' }),
      ]),
      // middle: title, sub, stat
      el('div', { display: 'flex', flexDirection: 'column', gap: 22 }, [
        el(
          'div',
          { display: 'flex', flexWrap: 'wrap', fontFamily: 'Serif', fontSize: titleSize, lineHeight: 0.92, letterSpacing: -2, maxWidth: 1056 },
          richSpans(safe(card.title)),
        ),
        card.stat
          ? el('div', { display: 'flex', alignItems: 'baseline', gap: 20 }, [
              el('div', { display: 'flex', fontFamily: 'Serif', fontSize: 72, lineHeight: 1, color: C.accent }, safe(card.stat[0])),
              el('div', { display: 'flex', fontSize: 24, color: C.text2, maxWidth: 700 }, safe(card.stat[1])),
            ])
          : el('div', { display: 'flex' }),
        card.sub
          ? el('div', { display: 'flex', fontSize: 25, lineHeight: 1.45, color: C.text2, maxWidth: 1000 }, safe(card.sub))
          : el('div', { display: 'flex' }),
      ]),
      // bottom row
      el(
        'div',
        { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', borderTop: `1px solid ${C.line}`, paddingTop: 24 },
        [
          el('div', { display: 'flex', fontFamily: 'Serif', fontSize: 44, lineHeight: 1 }, [
            el('span', { whiteSpace: 'pre' }, `${card.firstName} `),
            el('span', { fontStyle: 'italic', color: C.accent }, card.lastName),
          ]),
          el('div', { display: 'flex', fontSize: 20, letterSpacing: 1, color: C.muted }, card.domain),
        ],
      ),
    ],
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], { width: 1200, height: 630, fonts: loadFonts() });
  return new Resvg(svg, { fitTo: { mode: 'width', value: 1200 } }).render().asPng();
}
