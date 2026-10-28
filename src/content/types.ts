/**
 * Shapes of the content files in this folder.
 * You rarely need to touch this file — it's what lets VS Code autocomplete
 * fields and flag mistakes while you edit the other content files.
 *
 * Text tip: anywhere a field says "supports *emphasis*", wrapping words in
 * asterisks renders them in the orange italic accent, e.g. 'into *clear decisions.*'
 */

export type ProjectStatus = 'shipped' | 'next' | 'queued';

export interface ProjectLink {
  label: string;
  href: string;
}

export interface Project {
  /** URL slug: the page lives at /work/<id>. Lowercase, hyphens, no spaces. */
  id: string;
  /** Display number, e.g. '01'. */
  num: string;
  status: ProjectStatus;
  title: string;
  /** Short category line, e.g. 'Banking analytics'. */
  kind: string;
  /** Used by the filter pills on the Work page (see `workFilters` in projects.ts). */
  cats: string[];
  /** Tech stack. The first 3 show in the Work list. */
  tags: string[];
  /** One-liner shown in lists and the project header. */
  summary: string;
  /** "(A) The question" on the project page. */
  question: string;
  /** "How it was built" (shipped) or "The plan" (not shipped). */
  steps: string[];
  /** Shipped only — big stats: [value, label]. The first one is orange. */
  results?: [string, string][];
  /** Shipped only — orange buttons under the results. */
  links?: ProjectLink[];
  /** Not shipped — build month, e.g. 'Nov 2026'. */
  when?: string;
  /** Not shipped — "Done when" criteria. */
  done?: string;
  /** Optional hobby this project grew out of — shows "Fuelled by <hobby>". */
  hobby?: string;
  /** Cover image path inside /public, e.g. '/images/projects/credit-risk.png'. */
  cover?: string;
  /** Placeholder text shown until `cover` is set. */
  coverPlaceholder?: string;
  /** Live Tableau Public dashboards, embedded on the project page (load on click). */
  dashboards?: Dashboard[];
  /** Shows the interactive trek planner (map, filters, table) on the project page. */
  planner?: boolean;
  /** Extra screenshots shown under the dashboards, e.g. a tool that can't be embedded. */
  gallery?: Gallery;
}

export interface Gallery {
  /** Section heading, e.g. 'Metabase dashboard'. */
  title: string;
  /** One line under the heading. */
  note?: string;
  /** Images inside /public, each with a short caption. */
  images: { src: string; caption: string }[];
}

export interface Dashboard {
  /** Tab label, e.g. 'Portfolio model'. */
  label: string;
  /** Tableau Public view path: '<Workbook>/<View>' from public.tableau.com/views/<Workbook>/<View>. */
  view: string;
  /** Still preview shown before it loads, inside /public. */
  preview: string;
  /** Width / height of the dashboard, e.g. 1472 / 908 — keeps the frame the right shape. */
  ratio: number;
  /** Fixed dashboard width in px, if it has one; the embed is then scaled down to fit. */
  width?: number;
}

export interface NavLink {
  label: string;
  href: string;
}

export interface Stat {
  value: string;
  label: string;
}

export interface Hobby {
  /** Unique key (used for the image file name suggestion). */
  id: string;
  name: string;
  /** Small label on the right, e.g. 'Creative'. */
  type: string;
  /** Two stat bars, values out of 10. */
  stats: [string, number][];
  /** "Special move" name. */
  move: string;
  flavor: string;
  /** Link to a project: a project id, or 'all' for the Work page. */
  powers?: string;
  /** Image path inside /public, e.g. '/images/hobbies/photo.jpg'. */
  image?: string;
  /** Placeholder text shown until `image` is set. */
  imagePlaceholder: string;
}

export interface Milestone {
  when: string;
  org: string;
  role: string;
  description: string;
}

export interface Job {
  org: string;
  role: string;
  location: string;
  when: string;
  /** Optional one-line context under the role. */
  context?: string;
  /** Bullets, optionally grouped under small headings. Bullets support *emphasis* (brightens the key phrase). */
  groups: { title?: string; points: string[] }[];
  link?: ProjectLink;
}

export interface ResumeProject {
  title: string;
  stack: string;
  when: string;
  /** Optional project id from projects.ts — links the title to its case-study page. */
  id?: string;
  links?: ProjectLink[];
  /** Bullets support *emphasis*. */
  points: string[];
}

export interface Certification {
  name: string;
  issuer?: string;
  when: string;
  href?: string;
}

export interface LeadershipRole {
  role: string;
  org: string;
  when: string;
  description: string;
}
