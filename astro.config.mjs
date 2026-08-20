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
	fonts: [
		{
			provider: fontProviders.google(),
			name: 'Outfit',
			cssVariable: '--font-outfit',
			fallbacks: ['sans-serif'],
			weights: [500, 600, 700],
		},
		{
			provider: fontProviders.google(),
			name: 'Inter',
			cssVariable: '--font-inter',
			fallbacks: ['sans-serif'],
			weights: [400, 500, 700],
		},
	],
});
