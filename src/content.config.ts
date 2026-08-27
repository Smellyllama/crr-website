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

// Single-entry collection: src/content/pages/home.md. Every string the
// homepage shows lives here — components take props, they don't hold copy.
const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/pages" }),
  schema: z.object({
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
  }),
});

export const collections = { "race-reports": raceReports, races, pages };
