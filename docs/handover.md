# Handover notes

Decisions that look like oversights unless you know why. Anything here is
deliberate — check with the note before "fixing" it.

---

## Deleting is switched off in the CMS

`public/admin/config.yml` sets `delete: false` on the `race-reports` and
`races` collections. This is deliberate. Do not set it back to `true` without
doing the work in the next section first.

**What happened.** On 4 September 2026, deleting a single test race report
through the CMS deleted every photo in `src/content/race-reports/images/` —
23 files belonging to twenty other posts. Commit `13784bc`, restored in
`7fb8f5b`. The post that triggered it referenced exactly one image, and that
image belonged to a different post, so this was not about which photos the
entry used.

**Why.** Both collections set an entry-relative media folder:

```yaml
folder: src/content/race-reports
media_folder: images      # no leading slash → relative to the entry
public_folder: ./images
```

Sveltia's rule, from its documentation:

> Assets stored in entry-relative folders are only accessible by the associated
> entry and not available for other entries. Therefore, Sveltia CMS
> automatically deletes these assets when the associated entry is deleted.

A path without a leading slash is resolved relative to the entry, so Sveltia
treats `src/content/race-reports/images/` as private to whichever post is being
deleted. Every post shares that one directory, so deleting any post takes all
of them.

There is no separate setting for this. The Sveltia config schema has no option
governing asset deletion — `delete` on the collection is the only lever, which
is why deletion is off entirely rather than made safer.

Until this is reworked, **removing a post or a race is a Git job.**

## The fix, still to be decided

Two viable options. **Option A is the intended direction**, deferred rather
than rejected — with `delete: false` live the cascade cannot fire, so there is
no urgency and it should not be rushed.

**Option A — make the media folder absolute.** Point `media_folder` at
`/src/content/race-reports/images` (leading slash). That is a project-root
path, not an entry-relative one, so the auto-delete rule stops applying. No
files move, no frontmatter paths change, and Astro's image optimisation is
untouched. Deleting a post would then leave its photos behind as orphans,
which is the safe direction to fail in.

*Needs testing on a branch before `delete` goes back on:* it pairs an absolute
`media_folder` with a relative `public_folder: ./images`, and that combination
needs checking — that Sveltia still writes `./images/…` into frontmatter, and
that the media picker still browses the folder.

**Option B — per-post page bundles.** `path: "{{slug}}/index"` with
`media_folder: ""`, giving every post its own folder with its photos beside it.
This is Sveltia's intended model and the only option where deletion becomes
genuinely correct and self-cleaning. Rejected for now because the migration
moves 21 posts, reassigns 25 images by hand, and **changes every race report's
URL** — Astro derives the route from the entry id, which gains `/index`.
Too costly this close to launch.

A third option, moving everything to `public/uploads`, was ruled out: it still
rewrites every path *and* loses Astro's image optimisation, because assets in
`public/` are not processed and `image()` in `src/content.config.ts` would have
to become `z.string()`.

## Related guards

`scripts/check-cms-schema.mjs` resolves every image path in every content file
against the filesystem, and fails the build if one is missing. That is the
general guard against this class of problem: had it existed, the deletion above
would have been a local error before the push rather than a red deploy.

`media_libraries.default.config.slugify_filename: true` normalises uploaded
filenames. Sveltia keeps the original name by default, which is how
`Baltonsborough 5Mile.jpg` — spaces and capitals — reached the repository. The
setting applies to new uploads only; that file still needs renaming by hand,
along with the reference to it in
`src/content/race-reports/2026-08-31-baltonsborough-somerset-village-show-5-mile-run-results-and-experience.md`.

## Content notes

### The welfare officer is named with consent

`src/content/legal/welfare.md` names **Lizzie Cox** as welfare officer, and the
welfare page and the contact page both print that name. That is deliberate and
consented to: **consent was given verbally on 12 September 2026.**

It is recorded here rather than as a comment in the content file because the
CMS rebuilds each file from the fields it knows about, and erases comments on
save.

The published contact is the forwarder, **welfare@chardroadrunners.com**, not a
personal address. A safeguarding contact should outlive the person holding the
role, and no volunteer's own inbox belongs on a public website. If the role
changes hands, the forwarder is repointed and the name here is updated — the
address on the page does not change.

There is a separate, unresolved question about the personal address that was
published before this, which is still in the git history. That is the
maintainer's decision and nothing here touches it.

## Who can edit the site

Not listed here. This repository is public, so a list of names and GitHub
handles in this file would be readable by anyone, and CLAUDE.md rules that out
for members' details. It would also go stale the first time somebody joined or
left.

The real list is the one GitHub keeps: **Settings > Collaborators and teams**
on the repository. That is always current, visible only to people who already
have access, and it records when each invitation was sent. Nothing needs to be
copied out of it.

Anyone who can sign in there can also use the CMS at `/admin` — same GitHub
account, same permissions. Removing somebody from that list removes their CMS
access too, which is the reason there is nothing else to revoke.
