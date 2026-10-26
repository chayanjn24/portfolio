/**
 * ABOUT PAGE copy. Text that supports *emphasis* renders asterisk-wrapped words in orange italic.
 */
import type { Hobby, Milestone } from './types';

export const intro = {
  label: '(03) About · Guwahati ⇄ Pune',
  /** One entry per line. Supports *emphasis* (the last line is orange italic by design). */
  headline: ['Load, stress', '& tolerance:', '*data has all three.*'],
  portrait: '/images/portrait.jpg',
  portraitPlaceholder: 'Portrait of you',
  /** Supports *emphasis*. */
  lead: 'Chayan Gulgulia. Data and business analyst who likes questions with *money on the line.*',
  body: 'Best at numbers that have to tie out and dashboards people actually open. Off the clock: behind a camera, on a trail, on a dance floor, or building something nobody asked for at 2 a.m. Speaks English and Hindi.',
};

export const hobbiesSection = {
  label: '(A) Off the clock · {hobbies} sides',
  title: 'The *other* dataset',
  hint: 'Hover or tap to open',
};

/**
 * The hover-reveal list. Add photos by dropping files in /public/images/hobbies/
 * and setting `image: '/images/hobbies/<file>'`.
 * `powers`: a project id (adds "Powers project NN ↗"), or 'all' for the Work page.
 */
export const hobbies: Hobby[] = [
  { id: 'analyst', name: 'Analyst', type: 'Main class', stats: [['SQL', 9], ['Python', 8]], move: 'Tie-out', flavor: 'Two sources, one truth. Doesn’t sleep until the totals match.', powers: 'all', imagePlaceholder: 'You, at your desk' },
  { id: 'vibecoder', name: 'Vibecoder', type: 'Builder · nocturnal', stats: [['Curiosity', 10], ['Sleep', 3]], move: 'Ship at 2 a.m.', flavor: 'This website was partly vibecoded. Obviously.', imagePlaceholder: 'Late-night setup' },
  { id: 'photo', name: 'Photographer', type: 'Creative', stats: [['Eye', 9], ['Patience', 8]], move: 'Golden hour', flavor: 'Waits forty minutes for the light. Gets one shot. Worth it.', imagePlaceholder: 'Your best photo' },
  { id: 'editor', name: 'Editor', type: 'Creative', stats: [['Colour grade', 8], ['Ctrl+Z', 10]], move: 'Final_final_v7', flavor: 'Same instinct as cleaning data: cut what doesn’t serve the story.', imagePlaceholder: 'An edit you like' },
  { id: 'dancer', name: 'Dancer', type: 'Performer', stats: [['Rhythm', 9], ['Stage fright', 2]], move: 'Drop the beat', flavor: 'Can feel a tempo shift before the chart shows it.', powers: 'music-pop', imagePlaceholder: 'Mid-move' },
  { id: 'movies', name: 'Movie nerd', type: 'Critic', stats: [['Trivia', 9], ['Spoiler restraint', 6]], move: 'Post-credits', flavor: 'Stays for the post-credits scene. Every time.', powers: 'movie-recs', imagePlaceholder: 'Favourite film still' },
  { id: 'trekker', name: 'Trekker', type: 'Explorer', stats: [['Altitude', 8], ['Snack supply', 10]], move: 'Summit push', flavor: 'Raised near the Northeast hills. Now collecting Sahyadri forts.', powers: 'trek-planner', imagePlaceholder: 'Summit photo' },
  { id: 'traveller', name: 'Traveller', type: 'Explorer', stats: [['Wanderlust', 10], ['Packing light', 3]], move: 'Guwahati ⇄ Pune', flavor: 'Two home bases, one window seat.', imagePlaceholder: 'Travel shot' },
  { id: 'cook', name: 'Cook', type: 'Support', stats: [['Spice', 9], ['Clean-up', 5]], move: 'Taste and adjust', flavor: 'Treats recipes like a hypothesis: change one variable at a time.', powers: 'quick-commerce', imagePlaceholder: 'Something you cooked' },
  { id: 'runner', name: 'Runner', type: 'Endurance', stats: [['Stamina', 8], ['Early alarms', 6]], move: 'Negative split', flavor: 'Second half faster than the first. Same plan for careers.', imagePlaceholder: 'Run route or race' },
  { id: 'reader', name: 'Reader', type: 'Scholar', stats: [['Pages', 8], ['Bookmark discipline', 4]], move: 'One more chapter', flavor: 'Reads three books at once and finishes all of them. Eventually.', imagePlaceholder: 'Current read' },
  { id: 'hardware', name: 'Hardware nerd', type: 'Tinkerer', stats: [['Spec sheets', 10], ['Restraint at sales', 2]], move: 'Benchmark', flavor: 'Reads spec sheets for fun. Has opinions about thermal paste.', imagePlaceholder: 'Your setup / gadget' },
];

export const pathSection = {
  label: '(B) The path',
  title: 'Save *points*',
};

/** Timeline, oldest first. */
export const path: Milestone[] = [
  { when: '2021 – 2025', org: 'NIT Silchar', role: 'B.Tech, Civil Engineering', description: 'CGPA 8.24. Learned structures, then learned that spreadsheets have them too.' },
  { when: 'Mar – Jun 2025', org: 'Datawrkz', role: 'Ad operations analyst intern, Bengaluru', description: '8 display campaigns on a £160K budget with pacing held at 95–105%. Lifted conversions 15–23% through segmentation and A/B tests, and cut reporting turnaround 35% with API and Looker automation.' },
  { when: 'Jul 2025 – Oct 2026', org: 'AdElement Media', role: 'Data analyst, Pune', description: 'Grew a $2.6M+ annual revenue portfolio 32% YoY. Cut the month-end close from 14 days to 3–4 and reconciled 100K+ records a month in SQL. Presented monthly reports to the CEO, COO and founder.' },
];

/** The last row of the timeline, linking to Contact. */
export const nextLevel = {
  when: 'Next level',
  title: 'Your team? →',
  description: 'Data, business or business-technology analyst roles. Pune, Bengaluru, Hyderabad, Gurgaon.',
};
