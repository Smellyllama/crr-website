// @ts-check

import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig, fontProviders, passthroughImageService } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	integrations: [mdx(), sitemap()],
	// Cloudflare's build environment can't run Sharp, so build-time image
	// resizing/webp conversion silently fails there (it works fine locally,
	// which is what made this hard to spot). Passthrough serves the original
	// files as static assets instead of transformed ones — bigger downloads,
	// but no dependency on Sharp being available at build time.
	image: {
		service: passthroughImageService(),
	},
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
