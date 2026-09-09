# Chard Road Runners

The website for [Chard Road Runners](https://www.strava.com/clubs/246805), an
England Athletics affiliated running club in Chard, Somerset, established 1981.

Astro, Tailwind and daisyUI, deployed to Cloudflare Workers. Content is
Markdown, edited by committee members through [Sveltia CMS](https://github.com/sveltia/sveltia-cms)
at `/admin` — no code, no terminal.

> ### ⚠️ Not announced yet
>
> `PRE_LAUNCH` in `src/consts.ts` is `true`, which puts a `noindex` tag on
> every page and makes `/robots.txt` disallow everything. Setting it to `false`
> is the launch switch. **See [docs/launch-checklist.md](docs/launch-checklist.md).**

## Working on it

| Command | What it does |
| :------ | :----------- |
| `npm install` | Install dependencies |
| `npm run dev` | Local preview at `localhost:4321` |
| `npm run build` | Run the checks, then build to `dist/` |
| `npm run check:cms` | Check the two schemas still describe the same fields |
| `npm run check:diary` | List diary entries running on stale evidence |

Push to `main` and Cloudflare builds and deploys it. There is no manual deploy
step.

## Where things are

| | |
| :-- | :-- |
| [CLAUDE.md](CLAUDE.md) | How the project works, and the rules that are not obvious from the code. **Read this first.** |
| [docs/launch-checklist.md](docs/launch-checklist.md) | Everything still to do before launch |
| [docs/content-model.md](docs/content-model.md) | The five content collections and their frontmatter |
| [docs/handover.md](docs/handover.md) | The CMS, and the things about it that have bitten us |
| [docs/race-diary.md](docs/race-diary.md) | How the race diary works and why it is deliberately vague about dates |
| [crr-sitemap.md](crr-sitemap.md) | Page structure and the content plan |

`src/content.config.ts` and `public/admin/config.yml` describe the same fields
twice. **A change to one is a change to the other, in the same commit** — if
they drift, the CMS accepts a post the build then rejects, and the failure
lands on the committee member who wrote it.
