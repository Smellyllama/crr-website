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
      images: z
        .array(z.object({ src: image(), alt: z.string() }))
        .default([]),

      excerpt: z.string(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { "race-reports": raceReports };
