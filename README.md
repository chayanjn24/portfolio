# Chayan Gulgulia — Portfolio

Astro static site. Dark, cinematic, one orange accent.

```bash
npm install        # once
npm run dev        # local preview at http://localhost:4321 (auto-reloads as you edit)
npm run build      # type-check + build (Vercel output in .vercel/output)
npm run spotify:auth  # one-time Spotify login for the now-playing bar (see below)
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
- `{shipped}`, `{queued}`, `{total}`, `{hobbies}` → live counts; add `:word` for words, e.g. `{shipped:word}` → "Four".
- `{num:<project id>}` → that project's number, e.g. `{num:trek-planner}` → "08". Use it instead of typing numbers.

### Common tasks

**Ship a project** — in `projects.ts`, set `status: 'shipped'`, add `results` and `links`, drop a screenshot into
`public/images/projects/` and set `cover: '/images/projects/<file>'`. It moves into the Home carousel automatically.

**Add a project** — copy an existing entry, give it a new unique `id` (its URL becomes `/work/<id>`).
Project numbers (01, 02…) follow their order in `projects.ts`, so moving an entry renumbers everything automatically.

**Add photos** — put files in `public/images/…` and set the `image` / `cover` / `portrait` field to the path
starting with `/images/`. Anything without an image shows a labelled placeholder.

**Update the downloadable résumé** — replace `public/Chayan_Gulgulia Resume.pdf` (keep the same name, or change `resumePdf` in `site.ts`).
The "Print / save PDF" button prints a light version of the résumé page itself.

**Show your phone number** — set `phone` in `site.ts` (leave `''` to hide it).

## Built in (nothing to maintain)

- **Link previews** — every page gets its own 1200×630 card (the image LinkedIn/WhatsApp show), drawn at build
  time from the content files by `src/pages/og/[...slug].png.ts`. Change the wording there or in the content.
- **Google** — `sitemap-index.xml` is generated on every build; `public/robots.txt` points search engines to it;
  each page carries "Person" data (name, title, LinkedIn, GitHub) for search results.
- **Analytics** — Vercel Web Analytics (cookie-free). Only runs on the live site; numbers appear in the Vercel
  dashboard under Analytics.
- **Fonts** — Instrument Serif and JetBrains Mono are served from the site itself (`@fontsource`), not Google Fonts.

- **Live Tableau** — add `dashboards` to a project in `projects.ts` (view path + preview image + shape). The page shows
  the preview with a "Load live dashboard" button; phones get a button that opens Tableau Public instead.
- **Spotify now playing** — the top bar shows what you're playing (or the last track) next to the time. It's the only
  live part of the site (`src/pages/api/now-playing.ts`); everything else is static. Turn it off with `spotify: false`
  in `site.ts`. Until it's set up, the bar shows "Pune · time" as before.

If the live address changes, update `site` in `astro.config.mjs` and the `Sitemap:` line in `public/robots.txt`.

### Spotify setup (one time, ~5 minutes)
1. Go to developer.spotify.com → Dashboard → **Create app**. Any name; Redirect URI: `http://127.0.0.1:8888/callback`;
   tick **Web API**. Open the app's Settings and copy the Client ID and Client secret.
2. In this folder: copy `.env.example` to `.env` and paste the two values after `SPOTIFY_CLIENT_ID=` and
   `SPOTIFY_CLIENT_SECRET=` (`.env` is never committed).
3. Run `npm run spotify:auth` → log in to Spotify in the browser that opens → it writes `SPOTIFY_REFRESH_TOKEN` into `.env`.
4. Vercel → your project → Settings → Environment Variables: add the same three names and values, then redeploy.
   Never paste these values into chats, issues or commits.

## Code layout (only if you want to change design or behaviour)

```
src/
  content/      ← all editable content (above)
  pages/        ← one file per URL; work/[id].astro renders every project page
  components/   ← Nav, Footer, ImageSlot, StatusBadge, RevealLines; home/ = Home sections
  scripts/      ← fx.ts (smooth scroll, page curtain, reveals, magnetic buttons),
                  hero-field.ts (particle hero), row-runner.ts (the game)
  lib/          ← helpers: text formatting, project status/badges, link-preview card drawing
  styles/       ← global.css: design tokens + shared classes + print styles
public/         ← images, favicon, résumé PDF (served as-is)
```

## Deploying to Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com → **Add New Project** → import the repo. Vercel detects Astro; keep the defaults.
3. Every `git push` redeploys. Set your final domain in `astro.config.mjs` → `site`.
