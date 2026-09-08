# Race diary — seed entries and build notes

30 calendar entries, derived from the club's own race reports. Every date in here
comes from a race a CRR member actually ran, not from scraping anyone's website.

---

## What these are, and what they aren't

Each entry records a race the club has done, with a **rule** for roughly when it
happens — "last Sunday in November", "first Sunday in February".

**Every rule is derived from a single observation.** One year's date, from one
race report. That's enough to be useful and nowhere near enough to be certain.
An annual race can move by a fortnight, change to a different weekend, or stop
happening altogether.

So every entry ships as `status: expected`. The page must render those as
approximate — "late November" or "usually the last Sunday in November" — and
never as a specific day. A member turning up to a race that was actually the week
before is a worse outcome than a page that admits it doesn't know.

`status: confirmed` with a `confirmedDate` is set by a human who has checked the
organiser's website. That's the only route to showing an exact date.

---

## Two entries worth reading before the rest

**Chard Flyer** is the only `fixedDate` entry — always New Year's Day, so the
rule can't drift.

**Forde Abbey** has a deliberately wrong-looking rule. The observed date is 15
July 2026, but that year was postponed from June after a red weather warning. The
note says so. It's the clearest example of why a single observation isn't a
pattern, and it's the club's own race, so somebody knows the real answer.

---

## Some of these may not belong

Judgement calls for whoever reviews them:

- **New York Marathon** was in the archive and is excluded here. It's a race one
  member ran, not part of the club's year.
- **Cornish Marathon**, **Bovington**, **New Forest** and the **Bad Cow** weekend
  are all a fair distance away. Worth keeping if members regularly travel to them,
  worth dropping if 2017 was a one-off.
- **Chard Chaser** was in its second year in 2017. Check it still runs.
- **Bad Cow Frolic**, **Marathon** and **Half** are three entries for one weekend.
  Might read better as one entry with a note.

Deleting an entry is easier than inventing one, so err towards keeping and let
the first review cut them.

---

## Building the page

**Group by month, newest first from today.** A running diary is read forwards —
what's coming up — so start at the current month and run twelve months out.
Past months drop off.

**Render approximate dates honestly.** "Last Sunday in November" or "late
November", with the confirmed ones showing a real date and looking visibly more
solid. Don't use colour alone to distinguish them.

**Link each entry to the race reports that mention it.** The race name in the
report frontmatter matches the `name` here, so the Bicton Blister entry can show
what members wrote about it in 2017. That's the "member reviews" idea from the
backlog, with no review system, no moderation and no new infrastructure — and it
improves every time someone posts a report.

**Feed the homepage.** The "coming up" section is currently a placeholder. Three
next entries, same rules.

**Schedule a rebuild.** A Cloudflare cron trigger, weekly, so the diary rolls
forward on its own and past events drop off without anyone doing anything. That's
what stops this lapsing the way the old hand-maintained calendar did.

---

## The monthly job

One committee member, twenty minutes a month: **check the next eight weeks
only.** For each race in that window, find the organiser's page, confirm the
date, set `status: confirmed` with the real date, and add the entry link.

Eight weeks is the window that matters — nobody enters a June race from a page
they're reading in January. Bounding it is what makes the job finishable, and a
finishable job is one that still gets done in a year's time.

---

## Retiring a race that no longer runs

Some of the seed entries are races that have since stopped. **Tick "Retired -
race no longer runs" in the CMS. Do not delete the entry.**

A retired entry disappears from the diary and from the homepage's next three.
The file stays in the repository, which is the whole point of it: it is a record
that somebody looked at this race and found it gone.

**Deleting instead would undo itself.** The entries here were derived from the
club's own race reports, and those reports are not going anywhere. Any later
pass over them — by hand or scripted — finds the same 2017 result for a race
that died in 2019 and adds it straight back, because nothing in the repository
says otherwise. A retired entry is what says otherwise.

So, for anything that derives diary entries from race reports:

> Skip a race name that already has an entry in `src/content/calendar-events`,
> whether or not that entry is retired. Existing entries win. New ones are only
> for names that appear nowhere.

The CMS entry list has **Still running** and **Retired** filters for finding
them. There is no default filter, so the list shows everything until you narrow
it.

### The ones flagged as worth reviewing

The notes above single these out as possibly not belonging: **Cornish
Marathon**, **Bovington**, **New Forest**, the three **Bad Cow** entries, and
**Chard Chaser** (in its second year in 2017). They shipped rather than being
dropped, on the basis that retiring one is easier than inventing it back. This
is the toggle for doing that.
