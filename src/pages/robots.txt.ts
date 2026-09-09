import type { APIRoute } from 'astro';
import { PRE_LAUNCH } from '../consts';

// Generated rather than a static file in public/, because it has to change on
// launch day and a file somebody has to remember to edit is a file that stays
// wrong. One flag now drives this and the noindex tag in BaseHead together.
export const GET: APIRoute = ({ site }) => {
	// Printed during every build while the flag is on. The failure mode for a
	// pre-launch switch is not turning it on, it is nobody remembering to turn
	// it off — a club site that never appears in a search for the club, with
	// nothing broken to notice.
	if (PRE_LAUNCH) {
		console.warn(
			'\n\x1b[33m! PRE_LAUNCH is on — noindex on every page, and robots.txt disallows everything.\x1b[0m\n' +
				'\x1b[2m  Set PRE_LAUNCH to false in src/consts.ts when the site is announced.\x1b[0m\n',
		);
	}

	const body = PRE_LAUNCH
		? [
				'# Not announced yet — see PRE_LAUNCH in src/consts.ts.',
				'#',
				'# This is a request, not a lock. It keeps the site out of search',
				'# results; it does not stop anyone who has the address. Nothing here',
				'# is private, and the repository is public.',
				'User-agent: *',
				'Disallow: /',
			].join('\n')
		: [
				'User-agent: *',
				'Disallow: /admin/',
				'',
				'# /admin/ is the CMS editing screen. It is not secret — anything there',
				'# is protected by GitHub sign-in, not by hiding it — but there is no',
				'# reason for it to appear in search results.',
				'',
				`Sitemap: ${new URL('sitemap-index.xml', site).href}`,
			].join('\n');

	return new Response(`${body}\n`, {
		headers: { 'Content-Type': 'text/plain; charset=utf-8' },
	});
};
