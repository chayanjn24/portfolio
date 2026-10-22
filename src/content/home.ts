/**
 * HOME PAGE copy.
 *
 * Text that supports *emphasis* renders asterisk-wrapped words in orange italic.
 * Counters fill in automatically from projects.ts / about.ts (usable in any page's copy):
 *   {shipped} {queued} {total} {hobbies}  → 3, 10, 13, 12
 *   {shipped:word} {queued:word} …        → Three, Ten, Thirteen
 */
import type { Stat } from './types';

export const hero = {
  /** Top meta row. */
  meta: ['(00) Portfolio — MMXXVI', 'Data & business analyst'],
  /** Two lines, bottom-left. Supports *emphasis*. */
  headline: ['I turn messy rows', 'into *clear decisions.*'],
  bio: 'Civil engineer turned analyst — SQL, Python, BI and ML, with a soft spot for fintech.',
  hints: ['Click to reshape the field', 'Scroll ↓'],
  /** Caption for each particle shape, in order: name, histogram, clusters, sphere. */
  shapeLabels: ['Chayan Gulgulia', 'A normal distribution', 'k-means, k = 3', 'Every point, in orbit'],
};

export const game = {
  label: '(01) Play',
  /** Supports *emphasis*. */
  title: 'Row *Runner*',
  intro:
    'Your pipeline is live. Jump the bad rows — NULL, #REF!, DUP — and collect the clean ones. Low-flying errors? Stay grounded.',
  controls: 'Space / ↑ / tap to jump · double jump allowed',
  /** Supports *emphasis*. */
  idleTitle: 'Clean data only *past this point.*',
  startLabel: '▶ Run pipeline',
  rerunLabel: '↻ Rerun pipeline',
  /** Words printed on obstacles. */
  badRows: ['NULL', 'NaN', '#REF!', 'DUP', 'ERR', 'N/A', '#DIV/0!', '???'],
  /** Rank by score — highest `min` you reach wins. */
  ranks: [
    { min: 0, title: 'Excel tourist' },
    { min: 150, title: 'Intern with potential' },
    { min: 450, title: 'Analyst' },
    { min: 900, title: 'Senior Analyst' },
    { min: 1500, title: 'Data Engineer' },
  ],
};

export const profile = {
  label: '(02) Profile',
  /** Supports *emphasis*. */
  text: 'Trained to build bridges at NIT Silchar. Now I build them between *data and decisions* — as a data analyst at AdElement Media, and after hours behind a camera, on a trail, or on a dance floor.',
  /** The first stat is orange. */
  stats: [
    { value: '$2.6M+', label: 'yearly book managed across 15 demand lines' },
    { value: '+32%', label: 'portfolio revenue, year on year' },
    { value: '100K+', label: 'records reconciled every month in SQL' },
    { value: '7–8h', label: 'analyst hours saved every week through automation' },
  ] satisfies Stat[],
};

export const selectedWork = {
  label: '(03) Selected work — {shipped} shipped, {queued} in the queue',
  /** Supports *emphasis*. */
  title: 'Shipped, *& shipping.*',
  allLink: 'All {total} projects ↗',
  queueTitle: 'Building in *public* ↗',
};

export const capabilities = {
  label: '(04) Capabilities',
  title: 'What I *do*',
  items: [
    { title: 'Data analytics', detail: 'SQL · Python · pandas' },
    { title: 'Business analysis', detail: 'Question → decision' },
    { title: 'Machine learning', detail: 'XGBoost · clustering · forecasting' },
    { title: 'Finance & fintech', detail: 'Credit risk · fraud · revenue' },
    { title: 'Dashboards & BI', detail: 'Tableau · Power BI · Plotly' },
    { title: 'Automation', detail: 'Kill the repetitive work' },
  ],
};

/** "Off the clock" teaser list. The full set lives in about.ts. */
export const offTheClock = {
  label: '(05) Off the clock',
  title: 'The *other* dataset',
  link: 'Meet all {hobbies} ↗',
  items: [
    { name: 'Photography', detail: 'Street, light and the in-between moments.' },
    { name: 'Trekking', detail: 'Sahyadri weekends — becoming project 07.' },
    { name: 'Dancing', detail: 'Freestyle floors — and why project 10 asks what makes a hit.' },
    { name: 'Cooking', detail: 'Recipes as experiments — feeding project 05.' },
    { name: 'Movies', detail: 'A watchlist longer than my query history — project 11.' },
    { name: 'Vibe-coding', detail: '2 a.m. side projects, shipped for fun.' },
  ],
};
