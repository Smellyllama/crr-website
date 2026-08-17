# Chard Road Runners — Website

## The project

Rebuilding the website for Chard Road Runners (CRR), an England Athletics affiliated running club in Chard, Somerset, established 1981. The current site is on Webador and looks about twenty years old. It's being replaced.

The site needs to do five things: welcome newcomers and explain how to join, promote the club's two races, publish race reports as a proper blog, show championship and handicap results, and host photos. The aim is for it to become a hub members actually use, rather than everything living on Facebook.

See `crr-sitemap.md` in this folder for the full page structure and content plan. Read it before proposing any structural changes.

## Stack

- **Astro** — static site, blog template as the starting point
- **Tailwind CSS v4** via `@tailwindcss/vite` (no `tailwind.config.js`, config lives in CSS)
- **daisyUI v5** — component library, configured with `@plugin` in CSS
- **TypeScript**, strict
- **Markdown** for race reports and news posts
- Deployment target is Cloudflare Pages or Netlify. Not set up yet.
- A git-based CMS (TinaCMS or Decap) will be added later so committee members can post without touching code. Keep content in Markdown collections so that stays straightforward.

## Brand

Club colours come from the kit, specified as Pantone by the kit supplier:

- **PMS 4147** — dark navy — `#262141` — primary
- **PMS 4149** — pale blue — `#8AABC6` — secondary

Navy is the base. White text on navy for the hero. Pale blue for links, highlights and accents. A third accent colour for calls to action is still to be chosen.

The daisyUI theme is named `crr` and is set as default. It's defined in `src/styles/app.css` and applied via `data-theme="crr"` on the `<html>` tag.

There's a design motif to work in: LIDAR topographic contour lines of Chard, from real elevation data. These should appear as a subtle background texture — pale blue at low opacity over navy. Don't let them compete with text.

## How I work

I'm not a developer. I'm technically confident, good at following instructions and troubleshooting, but I'm learning this stack as I go. So:

- Explain what a change does and why before or as you make it, in plain terms
- When you introduce a new concept — collections, frontmatter, layouts, islands — give me a sentence on what it is
- Tell me when there's a simpler way to do something I've asked for
- If I ask for something that's a bad idea, say so and explain the trade-off. I'd rather be told now than find out in three months
- Prefer boring, well-documented solutions over clever ones. This site needs to be maintainable by whoever inherits it
- Keep dependencies minimal

## Content rules

- Race reports live in `src/content/` as Markdown, one file per post
- Every post needs: title, date, author, category, hero image, excerpt
- Categories: Race Report, Club News, Couch to 5k, Social
- Championship and handicap results come from Google Sheets and are pulled in, not hand-maintained in code. This has not been setup yet but can be easily created when required.
- Real content from the old site should be carried over even where dates are stale — flag anything that needs updating rather than inventing a replacement
- Don't invent club facts. If you need a committee name, a fee, or a date I haven't given you, ask or leave a clear placeholder

## Things not to build

- No shop. Kit is displayed with photos and prices; members order by email
- No members-only login area for now
- Strava integration is a later phase, not part of the initial build. Club is
  [Chard Road Runners on Strava](https://www.strava.com/clubs/246805/leaderboard)
  (club id `246805`). Two ready-made embeds to drop in when this phase starts:

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

  Likely home for these is the Home page or a Results sidebar — not decided yet.

## Housekeeping

- Commit in small, described chunks
- Don't commit anything with personal contact details beyond what's already public on the old site
- The welfare officer's contact must stay easy to find — it belongs in the footer on every page
