# Richmond Petersburg Christadelphians

Static site built with [Eleventy](https://www.11ty.dev/) and Sass. Deployed on Netlify (see `netlify.toml`).

## Content editing (Decap CMS)

Editors open **`/admin/`** on the deployed site (or locally after running the dev server). The CMS edits Markdown and JSON files in this repo.

**Netlify (one-time setup):**

1. Link this GitHub repo to a Netlify site (build: `npm run build`, publish: `_site`).
2. **Site configuration → Identity:** enable Identity, set registration to **Invite only** (recommended).
3. **Identity → Services → Git Gateway:** enable Git Gateway so Decap can commit changes.
4. Under Identity, **invite** each person who should edit.
5. Set **`YOUTUBE_API_KEY`** in Site settings → Environment variables if you want the home page to pull Bible Unlocked videos from the YouTube API; manual videos in the CMS still appear first either way.

**What editors can change:**

- **Articles** — Markdown files in `src/posts/` (listed at `/blog/`).
- **Service schedule** — `src/_data/schedule.json` (home hero, home cards, footer, contact, visit page times).
- **Manual video links** — `src/_data/manualVideos.json` (optional; entries are prepended before YouTube API results).

Media uploads go to `src/assets/uploads/` (configured in `src/admin/config.yml`).

## Local development

```bash
npm install
npm run dev
```

Build production output:

```bash
npm run build
```

Output is written to `_site/`.
