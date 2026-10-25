/**
 * HOME PAGE copy.
 *
 * Text that supports *emphasis* renders asterisk-wrapped words in orange italic.
 * Counters fill in automatically from projects.ts / about.ts (usable in any page's copy):
 *   {shipped} {queued} {total} {hobbies}  → 3, 10, 13, 12
 *   {shipped:word} {queued:word} …        → Three, Ten, Thirteen
 *   {num:<project id>}                    → that project's number, e.g. {num:trek-planner} → 08
 */
import type { Stat } from './types';

export const hero = {
  /** Top meta row. */
  meta: ['(00) Portfolio · MMXXVI', 'Data & business analyst'],
  /** Two lines, bottom-left. Supports *emphasis*. */
  headline: ['Messy rows in.', '*Clear decisions out.*'],
  bio: 'Civil engineer turned data analyst. SQL, Python, BI and ML, with a soft spot for fintech.',
  hints: ['Click to reshape the field', 'Scroll ↓'],
  /** Caption for each particle shape, in order: name, histogram, clusters, pipeline, table, funnel, sphere. */
  shapeLabels: ['Chayan Gulgulia', 'A normal distribution', 'k-means, k = 3', 'Source to dashboard', 'One clean row', 'Visit to signup', 'Every point, in orbit'],
};

export const game = {
  label: '(01) Play',
  /** Supports *emphasis*. */
  title: 'Row *Runner*',
  intro:
    'Your pipeline is live. Jump the bad rows (NULL, #REF!, DUP) and collect the clean ones. Low-flying errors? Stay grounded.',
  controls: 'Space / ↑ / tap to jump · double jump allowed · grab ◆ VALIDATE for a shield',
  /** Supports *emphasis*. */
  idleTitle: 'Clean data only *past this point.*',
  startLabel: '▶ Run pipeline',
  rerunLabel: '↻ Rerun pipeline',
  /** The shield power-up: its label, and the messages shown in the game. {rank} = the new rank. */
  shieldLabel: 'VALIDATE',
  shieldOn: 'Validated. The next error bounces off',
  shieldUsed: 'Error caught by validation',
  promoted: 'Promoted → {rank}',
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
  text: 'Trained as a civil engineer at NIT Silchar, then moved into data. At AdElement Media, owned the *revenue, billing and reconciliation data* behind a $2.6M+ portfolio. Off the clock: behind a camera, on a trail, or on a dance floor.',
  /** The first stat is orange. */
  stats: [
    { value: '$2.6M+', label: 'annual revenue portfolio across 15 partner accounts' },
    { value: '+32%', label: 'portfolio revenue, year on year' },
    { value: '100K+', label: 'records reconciled every month in SQL' },
    { value: '7–8h', label: 'analyst hours saved every week through automation' },
  ] satisfies Stat[],
};

export const selectedWork = {
  label: '(03) Selected work · {shipped} shipped, {queued} queued',
  /** Supports *emphasis*. */
  title: 'Shipped, *& shipping.*',
  allLink: 'All {total} projects ↗',
  queueTitle: 'Building in *public* ↗',
};

export const capabilities = {
  label: '(04) Capabilities',
  title: 'Core *skills*',
  items: [
    { title: 'Data analytics', detail: 'SQL · Python · PySpark' },
    { title: 'Business analysis', detail: 'Question → decision' },
    { title: 'Machine learning', detail: 'XGBoost · Spark ALS · forecasting' },
    { title: 'Finance & fintech', detail: 'Credit risk · fraud · revenue' },
    { title: 'Dashboards & BI', detail: 'Tableau · Power BI · Plotly' },
    { title: 'Automation', detail: 'Reports that run themselves' },
  ],
};

/** "Off the clock" teaser list. The full set lives in about.ts. */
export const offTheClock = {
  label: '(05) Off the clock',
  title: 'The *other* dataset',
  link: 'Meet all {hobbies} ↗',
  items: [
    { name: 'Photography', detail: 'Street, light and the in-between moments.' },
    { name: 'Trekking', detail: 'Sahyadri weekends, soon project {num:trek-planner}.' },
    { name: 'Dancing', detail: 'Freestyle floors, and the reason project {num:music-pop} asks what makes a hit.' },
    { name: 'Cooking', detail: 'Recipes as experiments, feeding project {num:qcom-dbt}.' },
    { name: 'Movies', detail: 'A watchlist longer than any query history. Hence project {num:movie-recs}.' },
    { name: 'Vibe-coding', detail: '2 a.m. side projects, shipped for fun.' },
  ],
};
