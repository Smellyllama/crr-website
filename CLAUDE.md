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

Four, all in `src/content/`: **`race-reports`**, **`races`**, **`pages`** and
**`legal`**.

**See `docs/content-model.md`** for what each one holds, the race-reports
frontmatter rules, and how the two schemas are kept in step.

The one rule that cannot wait until you open that file: `src/content.config.ts`
and `public/admin/config.yml` describe the same fields twice. **A change to one
is a change to the other, in the same commit.** If they drift, the CMS accepts a
post the build then rejects, and the failure lands on the committee member who
wrote it — the exact thing the CMS exists to prevent.

## Brand

Club colours come from the kit, specified as Pantone by the supplier:

- **PMS 4147** — `#262141` — primary. Reads as a deep purple, not navy.
- **PMS 4149** — `#8AABC6` — secondary, pale blue.

Two more come from the logo, defined in `src/styles/app.css` as `--color-sky`
and `--color-chalk`:

- **sky blue** — `#96C8FA` — the logo's wordmark colour.
- **chalk** — `#F2EFE9` — the logo's mark colour, an off-white.

An accent colour for calls to action is **still to be chosen**, and the sky blue
is **not** it. It is named `--color-sky`, for what it is, rather than
`--color-accent` precisely so that naming it does not quietly settle that
decision. Three blues still give nothing to make a primary button stand out,
which is how a `btn-secondary` with matching foreground and background shipped
invisible at 1:1 contrast.

### Palette rules — not optional

- Pale blue on white is **2.41:1 and fails WCAG AA**. Never use it for text on a
  light background.
- Sky blue on white is **1.76:1 — worse than the pale blue**. Same rule, harder:
  text on dark and accents only, never on a light background.
- Sky blue on the purple is **8.49:1**, better than the pale blue's 4.6:1. Where a
  blue goes on the purple and the contrast matters, sky is the stronger choice.
- Dark purple for text on light backgrounds. Pale blue and sky blue for accents,
  borders, and text on dark only.
- Buttons need a foreground colour explicitly different from their fill. Pale
  blue fill with dark purple text gives ~5.7:1 and stays inside the palette.
- Check contrast by measuring, not by eye.
- A link in body copy needs a non-colour indicator — underline it. Colour plus
  a hover state is not enough: the default link colour is the dark purple,
  near enough identical to the body text, so a link in a paragraph is invisible
  until it is pointed at, and a hover state does not exist on a phone at all.
  WCAG 1.4.1 rules out colour as the only signal regardless. `.prose a` in
  `global.css` does this for the two places raw Markdown renders. Same family
  of mistake as the cascade bug: colour doing work colour cannot do alone.

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

**Outfit** for headings, **Inter** for body. Used through the CSS custom
properties `--font-outfit` and `--font-inter`. The `fonts` config in
`astro.config.mjs` defines them; `src/styles/global.css` only consumes them.

Both are geometric sans faces, so the contrast between heading and body is
subtle. Headings need weight and tighter letter-spacing to separate clearly from
body copy — don't rely on size alone.

**Self-hosted.** Astro's Fonts API (`fonts` in `astro.config.mjs`) downloads the
files at build time and serves them from our own domain, so no visitor's IP
reaches Google and there is no third-party request to explain on the privacy
page. Google sees the build, not the reader.

Don't swap this for `@fontsource`. It would be a step back: Astro also generates
metric-matched local fallbacks — `size-adjust`, `ascent-override` and the rest,
tuned to Arial — so text does not shift when the real font swaps in. `@fontsource`
ships the files and nothing else.

Weights are declared in the config and only those are built. Latin subset and
`font-display: swap` come as standard. Adding a weight to the config costs a
download on every page, so add one only when a design actually calls for it.

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
- **Client-side JavaScript is the exception, not the default**, and every piece of
  it has to earn its place. There are three, all vanilla, all a handful of lines:
  the header's scroll state, the distance unit toggle, and the inline script in
  `<head>` that sets the unit before first paint. No framework, no hydration.
  The rule was once "none at all on the homepage"; the unit switcher broke that
  deliberately, because a switch that skipped the homepage would have been worse
  than the JS it saved. Anything new should clear the same bar.
- **The site has to work with JavaScript blocked.** The unit switch is the test
  case: `data-units` is rendered on `<html>` by the server, so distances show
  whether or not a script runs, and the script only overrides it for a stored
  choice. The toggle itself hides without JS rather than sitting there dead.
  Written the other way round — attribute set by script — a JS-blocked reader
  saw no distances at all, because the CSS had nothing to match.
- Social previews (`og:image`) use the post's own hero image, falling back to the
  contour graphic — never a generic placeholder.
- Images through Astro's image component so dimensions are known and the page
  doesn't shift as they load.

## Measurement and verification

The browser pane's readings have twice been wrong in this project, and both
times sent work off in the wrong direction:

- A computed style reported a transparent background while the page was
  demonstrably solid — sending me chasing a CSS cascade bug that didn't exist
- A 0×0 viewport made every size reading meaningless, nearly prompting a "fix"
  to layout that wasn't broken

So: pixel measurements and scroll-0 screenshots are the readings to trust.
Computed-style reads and scrolled screenshots are not reliable here.

**Before acting on a surprising measurement, verify it.** Re-measure at a real
viewport width, or check on an actual device. A reading that contradicts what
you can see in a screenshot is a reason to distrust the tool, not the screenshot.

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
