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
	// EXPERIMENT, not a settled decision. passthroughImageService() was set here
	// because Cloudflare's build environment reportedly can't run Sharp. The cost
	// of the workaround is total: every width and height in the codebase is
	// declarative only, nothing is resized or converted, and source size is
	// served size across the whole site — 15.0 MB of images in dist/_astro, with
	// six large originals shipped twice under two hashes.
	//
	// The premise is worth testing. This is a static build: images are
	// transformed in Node during `astro build`, not in the Workers runtime, and
	// the Workers runtime is what the Cloudflare adapter's passthrough advice is
	// actually about. Sharp is already a dependency and works locally.
	//
	// Removing the line lets Astro use its default Sharp service. If Cloudflare's
	// build goes red, the error message is the point of the exercise: restore the
	// line and record what it said. Nothing else changes.
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
