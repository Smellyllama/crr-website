# Chard Road Runners — Website

## The project

Rebuilding the website for Chard Road Runners (CRR), an England Athletics affiliated running club in Chard, Somerset, established 1981. It replaces a Webador site that hadn't been touched in years.

The site needs to do five things: welcome newcomers and explain how to join, promote the club's two races, publish race reports as a proper blog, show championship and handicap results, and host photos. The aim is for it to become a hub members actually use, rather than everything living on Facebook.

The end goal is a **documented handover to the club as an organisation**, not to an individual. Every decision should be judged against whether the next person can pick it up.

See `crr-sitemap.md` for the page structure and content plan. Read it before proposing structural changes.

## Stack

- **Astro** — static site
- **Tailwind CSS v4** via `@tailwindcss/vite` (no `tailwind.config.js`, config lives in CSS)
  - Base element styles go in `@layer base`, never unlayered. Unlayered CSS beats
    anything in a cascade layer whatever the selector, so an unlayered `a` or `h2`
    silently overrides every utility class on that element. This bug was live
    site-wide for weeks before it was found.
- **daisyUI v5** — component library, configured with `@plugin` in CSS
- **TypeScript**, strict
- **Markdown** for all content
- **Deployment: live.** Cloudflare Workers, connected to the GitHub repo
  (`Smellyllama/crr-website`). Push to `main` and it builds and deploys itself.
  No manual `wrangler deploy` needed.
- A git-based CMS (TinaCMS or Decap) is still to be added, so committee members
  can post without touching code. **This is the single most important outstanding
  piece** — until it exists, the site depends on one person, which is the problem
  it was built to solve. Keep content in Markdown collections so it stays easy.

## Collections

Three, all in `src/content/`:

- **`race-reports`** — race reports and club news. Note the hyphen.
- **`races`** — the two club-hosted races.
- **`pages`** — copy for one-off pages (`home.md`, `join-us.md`).

Each has its own `images/` folder beside the Markdown, because image paths are
relative to the file. A photo used in two collections needs a copy in both.

### race-reports frontmatter

- **`races`** — an array, one entry per race the post covers. Weekend round-ups
  have up to five. Each has `name`, optional `distance`, and its own `raceDate`.
- **There is no top-level date field and one must not be added.** Sort by the
  earliest `raceDate` in the array, via the helper in `src/utils/`.
- **`distance`** is `{ value, unit }` with unit `"km"` or `"mi"` — never a string.
  This exists so a site-wide miles/km switch can convert. Never render it raw.
- `posted` — when the report was written. Display only, never for ordering.
- `dateApproximate` — when true, render month and year only.
- `author`, `heroImage`, `images` may all be absent. Posts with no photos must
  render cleanly using the contour fallback block.

### The CMS mirrors this schema

`public/admin/config.yml` describes these same fields a second time, as forms
for Sveltia CMS. **A change to `src/content.config.ts` is a change to
`public/admin/config.yml`, in the same commit.** If the two drift, the CMS
accepts a post that the Astro build then rejects — and that failure lands on
the committee member who wrote it, which is the exact thing the CMS exists to
prevent.

Two settings keep them agreeing, and both are easy to undo by accident:

- **`output.omit_empty_optional_fields: true`.** Without it, an untouched
  optional field is written as `''` or `null`. Astro reads those as the wrong
  type and fails the build; an absent key is what `.optional()` and
  `.default()` expect.
- **`required: false` on every optional field.** Sveltia defaults `required`
  to *true*, so a field left unmarked becomes mandatory in the editor even
  though Astro is happy without it.

Dates are safe unquoted: Sveltia writes YAML plain scalars, and Astro parses
frontmatter as YAML 1.2, so `raceDate: 2026-08-01` arrives as a date and
`startTime: 11:00:00` stays a string.

## Brand

Club colours come from the kit, specified as Pantone by the supplier:

- **PMS 4147** — `#262141` — primary. Reads as a deep purple, not navy.
- **PMS 4149** — `#8AABC6` — secondary, pale blue.

An accent colour for calls to action is **still to be chosen**. Two blues give
nothing to make a primary button stand out, which is how a `btn-secondary` with
matching foreground and background shipped invisible at 1:1 contrast.

### Palette rules — not optional

- Pale blue on white is **2.41:1 and fails WCAG AA**. Never use it for text on a
  light background.
- Dark purple for text on light backgrounds. Pale blue for accents, borders, and
  text on dark only.
- Buttons need a foreground colour explicitly different from their fill. Pale
  blue fill with dark purple text gives ~5.7:1 and stays inside the palette.
- Check contrast by measuring, not by eye.

The daisyUI theme is named `crr`, defined in `src/styles/app.css`, applied via
`data-theme="crr"` on `<html>`.

### Contour motif

LIDAR topographic contour lines of Chard, from real elevation data. The club's
visual signature.

- Stroke only, `currentColor`, so CSS drives the tint.
- Fill the container with `preserveAspectRatio="xMidYMid slice"` (desktop) or
  `xMidYMax slice` (mobile). The default `meet` letterboxes and leaves blank bands.
- `stroke-width: 7` desktop, `9` mobile. The raw `2` computes to under a pixel
  once scaled and disappears.
- Opacity around 0.5. Always `aria-hidden="true"`.
- Never place contours directly behind body copy — contrast drops to ~2.4:1 where
  a line crosses a letter. Backgrounds, headers, dividers and image fallbacks only.

## Typography

**Outfit** for headings, **Inter** for body. Referenced through CSS custom
properties `--font-outfit` and `--font-inter`, defined in `src/styles/global.css`.

Both are geometric sans faces, so the contrast between heading and body is
subtle. Headings need weight and tighter letter-spacing to separate clearly from
body copy — don't rely on size alone.

Currently loaded from Google's CDN. Worth self-hosting via `@fontsource` packages
— faster, and it stops every visitor's IP being sent to Google, which matters for
a UK club with no cookie banner.

## How I work

I'm not a developer. I'm technically confident, good at following instructions
and troubleshooting, but learning this stack as I go. So:

- Explain what a change does and why, in plain terms
- When you introduce a new concept — collections, frontmatter, layouts, islands —
  give me a sentence on what it is
- Tell me when there's a simpler way to do what I've asked for
- If I ask for something that's a bad idea, say so and explain the trade-off
- Prefer boring, well-documented solutions over clever ones
- Keep dependencies minimal
- **Flag rather than fix** when something needs a judgement call I haven't made.
  Ask, or leave a clear placeholder. Don't guess and don't quietly work around it.
- If a build won't go green, don't add a fallback that hides the problem — a
  missing date defaulting to today is worse than a failing build

## Content rules

- Don't invent club facts. If you need a committee name, a fee, a date or a
  distance I haven't given you, ask or leave a clear placeholder.
- **Never rewrite race report prose.** It's members' own writing, informal voice
  included. Typo fixes only.
- Placeholders must be valid in the field they sit in. Writing `TODO` into a
  field the schema types as a URL or date breaks validation — omit the key
  instead and leave a comment.
- Fields still containing "TODO" must be omitted from rendered output, never
  printed to visitors.
- Real content from the old site is carried over even where dates are stale —
  flag what needs updating rather than inventing a replacement.
- Copy comes from content files. No user-facing text hardcoded in components.
  Link labels are content; route paths stay in code.
- Categories: Race Report, Club News, Couch to 5k, Social.

## Standards

- **Mobile first.** Most visitors are on a phone. Test at 320, 375 and 414px.
- **Accessibility:** one `h1` per page, headings in order, visible keyboard focus,
  no text baked into images, `prefers-reduced-motion` respected, decorative
  graphics `aria-hidden`.
- **Alt text on every lead image**, not just in-body ones. Absent alt beats wrong
  alt — never ship the literal word "TODO" as alt text.
- **No client-side JavaScript on the homepage.** Keep it minimal elsewhere.
- Social previews (`og:image`) use the post's own hero image, falling back to the
  contour graphic — never a generic placeholder.
- Images through Astro's image component so dimensions are known and the page
  doesn't shift as they load.

## Things not to build

- No shop. Kit is displayed with photos and prices; members order by email.
- No members-only login area for now.
- Strava integration is a later phase. Club is
  [Chard Road Runners on Strava](https://www.strava.com/clubs/246805/leaderboard)
  (club id `246805`). Two ready-made embeds for when that starts:

  ```html
  <!-- Summary widget: recent activity feed, no ride list -->
  <iframe allowtransparency="true" frameborder="0" height="160" scrolling="no"
    src="https://www.strava.com/clubs/246805/latest-rides/67f798de53aa60017d6658b4a388a9950668f49f?show_rides=false"
    width="300"></iframe>

  <!-- Activity widget: same feed, with individual rides listed -->
  <iframe allowtransparency="true" frameborder="0" height="454" scrolling="no"
    src="https://www.strava.com/clubs/246805/latest-rides/67f798de53aa60017d6658b4a388a9950668f49f?show_rides=true"
    width="300"></iframe>
  ```

  Note these are third-party embeds and change the site's privacy position.

## Privacy and personal data

- **Never publish the club's bank details.** They appear on the membership form;
  they must not appear on the website. Payment goes through Connect My Club or by
  emailing the membership secretary.
- **Never publish anyone's home address**, including committee members'. Email
  contacts only.
- Championship and handicap results come from Google Sheets, published as CSV and
  read at build time. **Only finishing times and names go in that sheet.** Dates
  of birth, phone numbers, addresses, medical information and emergency contacts
  live in a separate, never-published file.
- Photographs of identifiable members need a privacy policy and a stated consent
  position before galleries go live.

## Housekeeping

- Commit in small, described chunks. One concern per commit.
- `Media/` is design source material and is gitignored — nothing in `src/`
  should reference it.
- The welfare officer's contact must stay easy to find — footer, every page.
