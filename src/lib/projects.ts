import { projects } from '@content/projects';
import type { Project } from '@content/types';

export const shipped = projects.filter((p) => p.status === 'shipped');
export const queue = projects.filter((p) => p.status !== 'shipped');

/** e.g. "Nov 2026 → Jan 2027", from the first and last queued project. */
export const queueRange = (() => {
  const months = queue.map((p) => p.when).filter(Boolean);
  if (!months.length) return '';
  const first = months[0];
  const last = months[months.length - 1];
  return first === last ? first : `${first} → ${last}`;
})();

export const projectHref = (p: Pick<Project, 'id'>) => `/work/${p.id}`;

export const getProject = (id: string) => projects.find((p) => p.id === id);

export function nextProject(p: Project): Project {
  const i = projects.indexOf(p);
  return projects[(i + 1) % projects.length];
}

export type BadgeTone = 'solid' | 'accent' | 'muted';

/** Status pill text + style. `long` = wording used on the project page. */
export function badge(p: Project, long = false): { text: string; tone: BadgeTone } {
  if (p.status === 'shipped') return { text: 'Shipped', tone: 'solid' };
  if (p.status === 'next') return { text: `${long ? 'Up next' : 'Next'} · ${p.when ?? ''}`, tone: 'accent' };
  return { text: long ? `Queued · ${p.when ?? ''}` : (p.when ?? 'Queued'), tone: 'muted' };
}
