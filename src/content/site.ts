/**
 * SITE-WIDE DETAILS — your name, contact info, nav and footer.
 * Change something here and it updates on every page.
 */
import type { NavLink } from './types';

export const site = {
  firstName: 'Chayan',
  lastName: 'Gulgulia',
  /** Used in browser tab titles: "<page> — Chayan Gulgulia". */
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: 'Data & business analyst',
  /** Default description for search engines and link previews. */
  description:
    'Chayan Gulgulia — data & business analyst. SQL, Python, BI and ML, with a soft spot for fintech.',

  email: 'chayangulgulia@gmail.com',
  /** Leave empty ('') to hide the phone number everywhere. */
  phone: '',
  linkedin: 'https://linkedin.com/in/chayan-gulgulia',
  github: 'https://github.com/chayanjn24',

  /** Shown in the footer ("Based"). */
  based: 'Guwahati ⇄ Pune',
  /** Live clock in the nav. */
  clock: { city: 'Pune', timeZone: 'Asia/Kolkata', suffix: 'IST' },
  /** Shown in the mobile menu next to the clock. */
  availability: 'Open to roles',
  copyrightYear: 2026,

  /** Your downloadable résumé PDF, inside /public. Leave '' to hide the download button. */
  resumePdf: '/resume.pdf',
};

/** Top navigation. Order = display order (numbered 01, 02…). */
export const nav: NavLink[] = [
  { label: 'Index', href: '/' },
  { label: 'Work', href: '/work' },
  { label: 'About', href: '/about' },
  { label: 'Résumé', href: '/resume' },
  { label: 'Contact', href: '/contact' },
];

export const footer = {
  label: '(→) Next step',
  /** One entry per line. Supports *emphasis*. */
  headline: ['Let’s make the', '*numbers talk.*'],
  cta: 'Get in touch ↗',
};
