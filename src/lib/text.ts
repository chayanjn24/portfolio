import { projects } from '@content/projects';
import { hobbies } from '@content/about';

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
  'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen', 'Twenty'];

export const counts: Record<string, number> = {
  shipped: projects.filter((p) => p.status === 'shipped').length,
  queued: projects.filter((p) => p.status !== 'shipped').length,
  total: projects.length,
  hobbies: hobbies.length,
};

/** Replace {shipped}, {total:word}, {num:trek-planner}, … with live values. Unknown tokens are left as-is. */
export function fill(s: string): string {
  return s
    .replace(/\{num:([\w-]+)\}/g, (m, id: string) => projects.find((p) => p.id === id)?.num ?? m)
    .replace(/\{(\w+)(:word)?\}/g, (m, key: string, word?: string) => {
      const n = counts[key];
      if (n === undefined) return m;
      return word ? (WORDS[n] ?? String(n)) : String(n);
    });
}

/** Escape HTML, fill counters, and turn *text* into <em>text</em>. Use with set:html. */
export function rich(s: string): string {
  return escapeHtml(fill(s)).replace(/\*(.+?)\*/g, '<em>$1</em>');
}

/** Plain text version of a rich string (asterisks stripped) — for titles, alt text, aria labels. */
export function plain(s: string): string {
  return fill(s).replace(/\*(.+?)\*/g, '$1');
}

export const pad2 = (n: number) => String(n).padStart(2, '0');
