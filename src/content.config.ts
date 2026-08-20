import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

const raceReports = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/race-reports" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      // When the running happened. Drives sort order, archives and filters.
      raceDate: z.date(),
      // When the report went up. Display only — never used for ordering.
      posted: z.date().optional(),
      // True when raceDate is a best guess (archive posts with no known race date).
      // Templates should render month and year only, not a full date.
      dateApproximate: z.boolean().default(false),
      // Empty string allowed: some archive posts have no known author
      author: z.string().default(""),
      category: z
        .enum(["Race Report", "Club News", "Couch to 5k", "Social"])
        .default("Race Report"),
      race: z.string().optional(),
      distance: z.string().optional(),
      // True for Chard Flyer and Forde Abbey — races the club puts on
      clubRace: z.boolean().default(false),
      // Optional throughout: posts without photos must render cleanly
      heroImage: image().optional(),
      images: z
        .array(
          z.object({
            src: image(),
            alt: z.string(),
          })
        )
        .default([]),
      excerpt: z.string(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { "race-reports": raceReports };
