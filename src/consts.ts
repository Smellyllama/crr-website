// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Chard Road Runners';
export const SITE_DESCRIPTION =
	'Sociable England Athletics affiliated running club in Chard, Somerset. Established 1981.';

// The six top-level nav items, per crr-sitemap.md. Keep this list to six —
// any more and the mobile menu becomes a list nobody reads.
export const NAV_LINKS: { href: string; label: string }[] = [
	{ href: '/', label: 'Home' },
	{ href: '/join-us', label: 'Join Us' },
	{ href: '/news', label: 'News' },
	{ href: '/our-races', label: 'Our Races' },
	{ href: '/results', label: 'Results' },
	{ href: '/contact', label: 'Contact' },
];

// Footer page links, per crr-sitemap.md. Welfare is first and stays
// findable in one click from any page.
export const FOOTER_PAGE_LINKS: { href: string; label: string }[] = [
	{ href: '/welfare', label: 'Welfare' },
	{ href: '/rules-and-constitution', label: 'Rules & Constitution' },
	{ href: '/privacy', label: 'Privacy' },
	{ href: '/club-kit', label: 'Club Kit' },
	{ href: '/results#race-calendar', label: 'Race Calendar' },
];

export const SOCIAL_LINKS = {
	facebook: 'https://www.facebook.com/groups/161908423862991/',
	strava: 'https://www.strava.com/clubs/246805/leaderboard',
};

export const ENGLAND_ATHLETICS_URL = 'https://www.englandathletics.org/';
