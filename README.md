# Chayan Gulgulia — Portfolio

Astro static site. Dark, cinematic, one orange accent.

```bash
npm install        # once
npm run dev        # local preview at http://localhost:4321 (auto-reloads as you edit)
npm run build      # type-check + build to dist/
```

## Changing content — you only need `src/content/`

| I want to change…                                   | Edit                       |
| --------------------------------------------------- | -------------------------- |
| Name, email, phone, LinkedIn/GitHub, nav, footer    | `src/content/site.ts`      |
| Home page copy, stats, game text, capabilities      | `src/content/home.ts`      |
| Projects (add, edit, ship, reorder) + Work filters  | `src/content/projects.ts`  |
| About intro, the 12 hobbies, timeline               | `src/content/about.ts`     |
| Résumé jobs, skills, education                      | `src/content/resume.ts`    |
| Contact page copy and form topics                   | `src/content/contact.ts`   |
| Colours, fonts, spacing                             | `src/styles/global.css` (top of file) |

VS Code autocompletes the fields, and `npm run build` stops with a clear error if a field is missing or mistyped.

### Text tricks

- `*words*` → orange italic accent, e.g. `'into *clear decisions.*'` (where a field's comment says it supports emphasis).
- `{shipped}`, `{queued}`, `{total}`, `{hobbies}` → live counts; add `:word` for words, e.g. `{shipped:word}` → "Three".

### Common tasks

**Ship a project** — in `projects.ts`, set `status: 'shipped'`, add `results` and `links`, drop a screenshot into
`public/images/projects/` and set `cover: '/images/projects/<file>'`. It moves into the Home carousel automatically.

**Add a project** — copy an existing entry, give it a new unique `id` (its URL becomes `/work/<id>`).

**Add photos** — put files in `public/images/…` and set the `image` / `cover` / `portrait` field to the path
starting with `/images/`. Anything without an image shows a labelled placeholder.

**Update the downloadable résumé** — replace `public/Chayan_Gulgulia Resume.pdf` (keep the same name, or change `resumePdf` in `site.ts`).
The "Print / save PDF" button prints a light version of the résumé page itself.

**Show your phone number** — set `phone` in `site.ts` (leave `''` to hide it).

## Code layout (only if you want to change design or behaviour)

```
src/
  content/      ← all editable content (above)
  pages/        ← one file per URL; work/[id].astro renders every project page
  components/   ← Nav, Footer, ImageSlot, StatusBadge, RevealLines; home/ = Home sections
  scripts/      ← fx.ts (smooth scroll, page curtain, reveals, magnetic buttons),
                  hero-field.ts (particle hero), row-runner.ts (the game)
  lib/          ← helpers: text formatting, project status/badges
  styles/       ← global.css: design tokens + shared classes + print styles
public/         ← images, favicon, résumé PDF (served as-is)
```

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com → **Add New Project** → import the repo. Vercel detects Astro; keep the defaults.
3. Every `git push` redeploys. Set your final domain in `astro.config.mjs` → `site`.
