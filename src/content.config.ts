import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const distance = z.object({
  value: z.number(),
  unit: z.enum(["km", "mi"]),
});

const raceReports = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/race-reports" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),

      // One entry per race the post covers. Weekend round-ups have several.
      // Sort posts by the EARLIEST raceDate in this array — there is no
      // top-level date field, so nothing can drift out of sync.
      races: z
        .array(
          z.object({
            name: z.string(),
            // Optional: timed events (12-hour, lapped ultras) have no fixed distance.
            // Stored as value + unit so the site-wide mi/km switch can convert.
            distance: distance.optional(),
            raceDate: z.date(),
          })
        )
        .min(1),

      // True when a raceDate is a best guess rather than confirmed.
      // Templates should render month and year only when this is set.
      dateApproximate: z.boolean().default(false),

      // When the report was written. Display only — never used for ordering.
      posted: z.date().optional(),

      // Empty string allowed: archive posts often have no byline.
      author: z.string().default(""),

      category: z
        .enum(["Race Report", "Club News", "Couch to 5k", "Social"])
        .default("Race Report"),

      // True for Chard Flyer and Forde Abbey — races the club puts on.
      clubRace: z.boolean().default(false),

      // Optional throughout: posts without photos must render cleanly.
      heroImage: image().optional(),
      // Only meaningful alongside heroImage. Provisional on archive posts
      // where nobody who was there has confirmed who's in the photo.
      //
      // INTENTIONALLY LOOSER THAN THE CMS — do not tighten to match it.
      // Optional here so the archive posts that arrived without alt text keep
      // building. The CMS requires it whenever a photo is set, enforced by the
      // preSave hook in public/admin/index.html, because Sveltia has no
      // conditional validation and `required: true` would demand a description
      // on posts that have no photo at all. New content gets alt text; old
      // content is left alone. See the matching note in public/admin/config.yml.
      heroImageAlt: z.string().optional(),
      images: z
        .array(z.object({ src: image(), alt: z.string() }))
        .default([]),

      excerpt: z.string(),
      draft: z.boolean().default(false),
    }),
});

const races = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/races" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),

      distance,

      // Next running of the race. Optional so the page still builds between
      // one year's race and the next year's date being confirmed.
      nextDate: z.date().optional(),
      startTime: z.string().optional(),
      venue: z.string().optional(),

      // entryUrl only renders when entriesOpen is true — this is what stops
      // a dead entry link sitting on the page for eleven months of the year.
      entryUrl: z.string().url().optional(),
      entriesOpen: z.boolean().default(false),

      series: z.string().optional(),
      seriesNote: z.string().optional(),

      juniorRace: z.boolean().default(false),
      juniorRaceNote: z.string().optional(),

      raceDirector: z.string().optional(),
      timing: z.string().optional(),
      resultsUrl: z.string().url().optional(),
      facebookEventUrl: z.string().url().optional(),

      heroImage: image().optional(),
      // Same intentional mismatch as race-reports: optional here, required by
      // the CMS whenever a photo is set. See the note above.
      heroImageAlt: z.string().optional(),

      // Controls order on the Our Races landing page.
      order: z.number().default(99),
    }),
});

const cta = z.object({ label: z.string(), href: z.string() });

const night = z.object({
  day: z.string(),
  time: z.string(),
  venue: z.string(),
  summary: z.string(),
  detail: z.string(),
});

// Copy nobody has written yet is parked in the content file as "TODO — …".
// Stripping it here means the page renders without that line, rather than
// publishing a note that was meant for whoever edits the file.
const draftable = z
  .string()
  .optional()
  .transform((value) =>
    value?.trimStart().startsWith("TODO") ? undefined : value
  );

// src/content/pages/home.md
const homePage = z.object({
  page: z.literal("home"),
  hero: z.object({
    heading: z.string(),
    strapline: z.string(),
    primaryCta: cta,
    secondaryCta: cta,
  }),
  clubNights: z.object({
    heading: z.string(),
    intro: z.string(),
    nights: z.array(night),
    reassurance: z.string(),
  }),
  handicap: z.object({
    heading: z.string(),
    body: z.string(),
  }),
  couchTo5k: z.object({
    heading: z.string(),
    body: z.string(),
    // Empty until a course date is confirmed — the page shows
    // emptyState instead of a blank or invented date.
    nextCourse: z.string().default(""),
    // Shown when nextCourse is empty.
    emptyState: z.string(),
    cta,
  }),
  latestReports: z.object({
    heading: z.string(),
    linkLabel: z.string(),
    emptyState: z.string(),
  }),
  upcoming: z.object({
    heading: z.string(),
    linkLabel: z.string(),
    emptyState: z.string(),
  }),
  ourRaces: z.object({
    heading: z.string(),
    intro: z.string(),
    linkLabel: z.string(),
  }),
});

// src/content/pages/join-us.md
const joinUsPage = z.object({
  page: z.literal("join-us"),
  hero: z.object({
    heading: z.string(),
    strapline: z.string(),
  }),
  firstVisit: z.object({
    heading: z.string(),
    intro: draftable,
    // Rendered as a labelled list. `detail` may hold what3words references
    // (///word.word.word) and, for the address, meaningful line breaks.
    steps: z
      .array(z.object({ label: z.string(), detail: z.string() }))
      .min(1),
    reassurance: z.string(),
  }),
  whichNight: z.object({
    heading: z.string(),
    // Each already names its own day — the template adds no heading of
    // its own, so the day stays part of the copy.
    tuesday: z.string(),
    thursday: z.string(),
  }),
  membership: z.object({
    heading: z.string(),
    intro: draftable,
    options: z
      .array(
        z.object({
          name: z.string(),
          price: z.string(),
          detail: z.string(),
        })
      )
      .min(1),
    renewal: draftable,
    howToPay: z.string(),
    connectMyClubCode: z.string(),
    // Empty until there's a form to point at. Nothing renders while it is,
    // so the page never shows a dead link.
    formUrl: z.string().default(""),
    membershipSecretary: z.string(),
    membershipEmail: z.string().email(),
  }),
  couchTo5k: z.object({
    heading: z.string(),
    body: z.string(),
    // Same pattern as the homepage: emptyState shows while this is blank.
    nextCourse: z.string().default(""),
    emptyState: z.string(),
  }),
  questions: z.object({
    heading: z.string(),
    body: z.string(),
  }),
});

// One collection, one file per page, each page its own shape. The `page`
// field picks the branch — which also means a validation error names the
// field that's wrong instead of listing every page's fields at once.
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.discriminatedUnion("page", [homePage, joinUsPage]),
});

export const collections = { "race-reports": raceReports, races, pages };
