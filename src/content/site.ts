/**
 * SITE-WIDE DETAILS — your name, contact info, nav and footer.
 * Change something here and it updates on every page.
 */
import type { NavLink } from './types';

export const site = {
  firstName: 'Chayan',
  lastName: 'Gulgulia',
  /** Used in browser tab titles: "<page> · Chayan Gulgulia". */
  get fullName() {
    return `${this.firstName} ${this.lastName}`;
  },
  role: 'Data & business analyst',
  /** Default description for search engines and link previews. */
  description:
    'Chayan Gulgulia, data and business analyst in Pune. SQL, Python, BI and machine learning, with a soft spot for fintech.',

  email: 'chayangulgulia@gmail.com',
  /** Leave empty ('') to hide the phone number everywhere. */
  phone: '',
  linkedin: 'https://linkedin.com/in/chayan-gulgulia',
  github: 'https://github.com/chayanjn24',

  /** Shown in the footer ("Based"). */
  based: 'Guwahati ⇄ Pune',
  /** Live clock in the nav. `city` shows only until Spotify is connected. */
  clock: { city: 'Pune', timeZone: 'Asia/Kolkata', suffix: 'IST' },
  /** Spotify "now playing" in the nav (needs the setup in README → Spotify). false = clock only. */
  spotify: true,
  /** Shown in the mobile menu next to the clock. */
  availability: 'Open to roles',
  copyrightYear: 2026,

  /** Your downloadable résumé PDF, inside /public. Leave '' to hide the download button. */
  resumePdf: '/Chayan_Gulgulia Resume.pdf',
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
  headline: ['Got numbers that', '*won’t add up?*'],
  cta: 'Get in touch ↗',
};
