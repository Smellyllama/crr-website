// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	// The real domain, used to build every canonical URL, share link, RSS item
	// and sitemap entry. Setting it publishes nothing on its own — it is a string
	// baked into the built HTML. What makes the site reachable is DNS and the
	// custom domain in Cloudflare, which are separate and still to be done.
	//
	// While PRE_LAUNCH in src/consts.ts is true, every page also carries a
	// noindex tag and robots.txt disallows everything.
	site: 'https://chardroadrunners.com',
	integrations: [mdx(), sitemap()],
	// No image service is set, which means Astro's default: Sharp, transforming
	// at build time.
	//
	// This used to be passthroughImageService(), on the grounds that Cloudflare's
	// build environment can't run Sharp. That was tested on 12 September 2026 and
	// is not true. Cloudflare Workers Builds runs `astro build` in Node, where
	// Sharp is an ordinary dependency; the passthrough advice applies to the
	// Cloudflare ADAPTER, which transforms in the Workers runtime, and this site
	// has no adapter. Measured on the preview deployment, not locally:
	//
	//     homepage          1,408 kB -> 176 kB
	//     /race-reports/    4,667 kB -> 702 kB
	//     cold build           3.9 s -> 4.5 s
	//
	// Do not reintroduce passthrough without re-testing. Its cost is total: it
	// makes every width and height in the codebase declarative only, so images
	// silently ship at source size and the explicit sizes on each <Image> stop
	// meaning anything.
	vite: {
		plugins: [tailwindcss()],
	},
	// styles: ['normal'] on both. Astro includes italic by default, and Inter's
	// italic was the largest file of the three at 51.6kB — preloaded on every page
	// for a single line, the "Posted" date on a race report. Dropped, the browser
	// slants the upright face instead. That is a synthesised oblique rather than
	// the real italic cut, which is a fair trade at that size and frequency; add
	// italic back if a design ever leans on it properly.
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Outfit',
			cssVariable: '--font-outfit',
			fallbacks: ['sans-serif'],
			weights: [500, 600, 700],
			styles: ['normal'],
		},
		{
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-inter',
			fallbacks: ['sans-serif'],
			weights: [400, 500, 700],
			styles: ['normal'],
		},
	],
});
