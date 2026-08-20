# Chard Road Runners — Sitemap & Page Structure

Draft v1. Built from the existing Webador site content. Dates and details carried over as-is and flagged where they need checking.

---

## Navigation

Six top-level items. Anything more and the mobile menu becomes a list nobody reads.

```
Home
Join Us
Race Reports    (race reports + club news)
Our Races       (Chard Flyer, Forde Abbey 10k)
Results         (championship, handicap, records)
Contact
```

**Footer:** Welfare · Rules & Constitution · Privacy · Club Kit · Facebook · Strava · Race Calendar · England Athletics affiliation

Moving "Boring legal stuff" to the footer frees a nav slot without hiding anything. Welfare gets its own footer link rather than being buried — it should be findable in one click from any page.

---

## 1. Home

The job: a first-time visitor understands the club in 10 seconds and knows how to turn up.

| Section | Content |
|---|---|
| Hero | Club name, LIDAR contour backdrop, one line: "Sociable England Athletics affiliated running club in Chard, Somerset. Established 1981." Primary button: **Join Us**. Secondary: **Club Nights** |
| Club nights | Tuesday 7pm and Thursday 7pm, Chard Cricket Club. Tuesday: up to three pace groups, 5–6 miles slowest to ~10 miles fastest, showers and bar after. Thursday: shorter and slower, suits beginners and improvers. Everyone welcome |
| What makes us different | Monthly handicap race and bake off on the last Tuesday of the month |
| Couch to 5k | Next course dates, venue, cost, target race. **Needs current dates — the live site still shows 9th April** |
| Latest news | Three most recent race reports, auto-pulled |
| Next events | Three next entries from the race calendar, auto-pulled |
| Our races | Chard Flyer and Forde Abbey 10k cards |

---

## 2. Join Us

Merges the current Home-page joining instructions with the membership form page.

- Who the club is for — all paces and abilities, no minimum speed
- What to expect on a first visit: where to park, what time to arrive, who to look for, that you don't need to be a member to try it
- Membership: Connect My Club, code `67a1c8f4`
- What membership includes — England Athletics affiliation, race discounts, championship entry, club kit access
- Fees and renewal date
- Couch to 5k: 18+, free to join, one-hour weekly sessions, medal at the end
- Contact: chardroadrunners@hotmail.com

---

## 3. Race Reports

The blog. This is the piece the current site is missing entirely and the reason members will come back.

- **Index**: card grid, newest first, image + title + date + two-line excerpt
- **Filters**: Race Report · Club News · Couch to 5k · Social
- **Post page**: title, date, author, hero image, body, photo gallery, results table if relevant, links to the next and previous posts
- Each post gets its own image and description tags so it looks right when shared to Facebook

**Content model** — every post carries: title, date, author, category, race name, distance, hero image, gallery, excerpt.

---

## 4. Our Races

Landing page covering both club-hosted races, then one page each.

**Chard Flyer** — 1st January, 10k, first race in the Somerset Series, route around Chaffcombe, Knowle St Giles and Chard Reservoir.

**Forde Abbey 10k** — usually a Wednesday evening in June.

Each race page: date, distance, entry link, route map and elevation, start time, parking, facilities, prizes and categories, previous years' results, photos, volunteer sign-up.

---

## 5. Results

Everything here reads from Google Sheets, so you keep editing where you already edit.

- **Club Championship** — current standings table, sortable, plus the scoring rules and which races count
- **Monthly Handicap** — latest month's results and the running standings
- **Club Records** — by distance and age category
- **Race Calendar** — upcoming races members are entering, championship races marked

---

## 6. Contact

- General enquiries email
- Committee list with roles
- **Welfare Officer** — name and contact, given its own visible block
- Where we meet, with a map
- Facebook and Strava links
- New members: a short "just turn up" note so nobody feels they have to email first

---

## Footer pages

- **Welfare** — policy plus the welfare officer's contact
- **Rules and Constitution** — carried over as-is
- **Privacy** — needed once you have any form or photo of a member
- **Club Kit** — photos, sizes, prices, Pantone-correct colours, order by email

---

## Content types to set up

These are the collections you'll define once and reuse:

1. `post` — race reports and news
2. `race` — the two club-hosted races
3. `calendar-event` — dated entries for the race calendar
4. `committee` — name, role, contact
5. `kit-item` — photo, name, sizes, price

Everything else is a static page you edit directly.

---

## Open questions

- Couch to 5k: current dates and next course
- Membership fee and renewal date
- Committee list and roles
- Does the club want a members-only area, or is everything public?
- Photo consent — worth a line in the privacy page before publishing galleries
