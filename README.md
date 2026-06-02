# Richmond Petersburg Christadelphians

Static site built with [Eleventy](https://www.11ty.dev/) and Sass. Deployed on Netlify (see `netlify.toml`).

## Content editing (Decap CMS)

Editors open **`/admin/`** on the deployed site (or locally after running the dev server). The CMS edits Markdown and JSON files in this repo.

**Netlify (one-time setup):**

1. Link this GitHub repo to a Netlify site with **continuous deployment** (not deploy-only uploads). Build: `npm run build`, publish: `_site`, production branch: **`main`** (must match `branch` in `src/admin/config.yml`).
2. **Site configuration → Identity:** enable Identity, set registration to **Invite only** (recommended).
3. **Identity → Services → Git Gateway:** enable Git Gateway so Decap can commit changes.
4. Under Identity, **invite** each person who should edit.

**CMS saves should trigger a new deploy automatically.** Git Gateway commits to `main` on GitHub; Netlify rebuilds on every push to the production branch—the same as when you push from your machine.

If the live site does not update after an editor saves in `/admin/`:

1. In GitHub, open **Commits** on `main` and confirm a new commit appeared when they saved (author is often `netlify-cms` or the editor’s email). If there is no commit, Git Gateway or Identity login is misconfigured.
2. In Netlify, open **Deploys** and check whether a deploy started for that commit. If the commit exists but no deploy ran, confirm the site is connected to the correct repo and branch under **Build & deploy → Continuous deployment**.
3. Under **Build & deploy → Build settings**, check **Ignored builds**—nothing should skip commits from the CMS.
4. **Optional fallback:** In Netlify go to **Build hooks → Add build hook**, copy the URL, and add a `postSave` listener in `src/admin/index.html` that `POST`s to that URL after each publish (only needed if commits reach GitHub but deploys still do not start).

**What editors can change:**

- **Articles** — Markdown files in `src/posts/` (listed at `/blog/`).
- **Service schedule** — `src/_data/schedule.json` (home hero, home cards, footer, contact, visit page times).
- **Videos** — `src/_data/manualVideos.json` (home page shows the 3 most recent; full list at `/videos/`).

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
