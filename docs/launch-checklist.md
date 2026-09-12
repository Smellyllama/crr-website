# Launch checklist

Everything that has to happen before the site is announced, and the one thing
that has to happen on the day. Target is **November 2026**.

Nothing here is broken. These are decisions and facts nobody has supplied yet,
left as gaps on purpose rather than filled with guesses.

---

## On the day — the switch

**Set `PRE_LAUNCH` to `false` in `src/consts.ts`, commit, push.**

That one line is the difference between a site nobody can find and a site
people can. While it is `true`:

- every page carries `<meta name="robots" content="noindex, nofollow">`
- `/robots.txt` says `Disallow: /` — nothing at all is to be crawled
- the build prints a yellow reminder saying so

With it `false`, `/robots.txt` goes back to allowing everything except the CMS
screen and starts advertising the sitemap. **Check `chardroadrunners.com/robots.txt`
after the deploy** — if it still says `Disallow: /`, the change did not deploy,
and the site will never appear in a search for the club with nothing looking
broken.

There is no separate `public/robots.txt` to edit. It is generated from that
flag, deliberately, so there is only one thing to remember.

This is not security. Anyone with the address can read every page today, and
this repository is public. It only stops the site being found by accident.

### And confirm ALLOWED_DOMAINS includes the live domain

**On the `crr-cms-auth` Worker, not this one.** It is the GitHub sign-in proxy
the CMS uses, and `ALLOWED_DOMAINS` is the list of hostnames allowed to use it.
Today it names the `workers.dev` address. The moment `/admin` is served from
`chardroadrunners.com` instead, sign-in fails with "Your domain is not allowed
to use the authenticator" until the new domain is on that list.

Set it to cover the naked domain and its subdomains, which need listing
separately:

```
chardroadrunners.com, *.chardroadrunners.com
```

Keep the `workers.dev` hostname on the list too while that address is still in
use, or the CMS stops working there the moment you change it.

This one fails quietly from the outside. The website is completely fine — it is
only the committee who cannot sign in to edit it, which is the one group who
will not be looking at it on launch day.

---

## Before the day

### Must be done, or the site is wrong

- **DNS and the custom domain in Cloudflare.** `site` in `astro.config.mjs` is
  already `https://chardroadrunners.com`, which is what makes canonical URLs,
  share links, RSS and the sitemap correct — but nothing resolves until the
  domain is attached. Attaching it also publishes the domain in public
  certificate transparency logs, so do it when you are ready to be findable.
- **Redirects from the old Webador URLs.** Needs the list of old addresses
  captured *before* that site is switched off. Without them, every link anyone
  has ever shared breaks on launch day.
- **Confirm Lizzie Cox is happy to be named as welfare officer**
  (`src/content/legal/welfare.md`). The address is now a club one; being named
  on a public page is a separate question and hers to answer.

### Words nobody has written yet

- **The privacy page** — three sections still empty, awaiting committee wording.
- **The committee list** on the contact page (`src/content/pages/contact.md`) —
  roles and names, once people have said they are happy to be listed. Nothing
  renders while it starts with `TODO`.
- **Both race pages** (`src/content/races/`) — parking, registration times,
  facilities, baggage, prizes, the course description, and who marshals contact.
  Chard Flyer also has no race director named and no alt text on its hero image.
- **Join Us** — when membership renews, and whether the Connect My Club code
  carried over from the old site is still current.

### Decisions

- **Which races count for the championship.** Every one of the 30 diary entries
  carries `championship: false` with a `TODO`. One list settles all of them.
- **Forde Abbey's slot** — fourth Wednesday in June, or last? 2026 was both, so
  the diary is guessing. It is the club's own race; somebody knows.

### Loose ends worth closing

- **`npm run check:diary`** lists diary entries running on evidence over three
  years old — 11 today. Each needs confirming with the organiser or retiring.
- **The Full MontyCute entry link** is commented out in its diary entry;
  entries are open and the real Race Nation URL needs pasting in.
- **The club Google Calendar** on `/calendar` — blocked on the club Google
  account. The agreed version reads the calendar's `.ics` feed at build time
  rather than embedding an iframe. See `backlog.md`.
- **The 2017 Dark Valley race report** is still `draft: true` and is the only
  history that entry has.
- **The weekly rebuild** (`workers/diary-rebuild/`) — confirm a Monday build
  actually fired, in the Worker's Logs tab.
