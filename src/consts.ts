// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

export const SITE_TITLE = 'Chard Road Runners';
export const SITE_DESCRIPTION =
	'Sociable England Athletics affiliated running club in Chard, Somerset. Established 1981.';

// The first thing a keyboard user tabs to on any page, letting them jump the
// nav instead of tabbing through it. Kept here with the other nav labels, not
// in a content collection: it is an assistive control rather than club copy,
// and it must never be edited to something empty or vague.
export const SKIP_LINK_LABEL = 'Skip to content';

// The id it targets, and the id on <main>. One constant so they cannot drift.
export const MAIN_CONTENT_ID = 'main-content';

// The top-level nav, per crr-sitemap.md. Seven items: Calendar and Results were
// one item until the two turned out to answer different questions — "when is
// the next race" and "how did we do" — and a page trying to do both buried the
// calendar under standings tables. Seven is the ceiling. Any more and the
// mobile menu becomes a list nobody reads.
export const NAV_LINKS: { href: string; label: string }[] = [
	{ href: '/', label: 'Home' },
	{ href: '/join-us', label: 'Join Us' },
	{ href: '/race-reports', label: 'Race Reports' },
	{ href: '/our-races', label: 'Our Races' },
	{ href: '/calendar', label: 'Calendar' },
	{ href: '/results', label: 'Results' },
	{ href: '/contact', label: 'Contact' },
];

// Footer page links, per crr-sitemap.md. Welfare is first and stays
// findable in one click from any page.
export const FOOTER_PAGE_LINKS: { href: string; label: string }[] = [
	{ href: '/welfare', label: 'Welfare' },
	{ href: '/inclusion', label: 'Inclusion' },
	{ href: '/rules-and-constitution', label: 'Rules & Constitution' },
	{ href: '/privacy', label: 'Privacy' },
	{ href: '/club-kit', label: 'Club Kit' },
	// The diary specifically, not the top of the page — the label promises races
	// and the club calendar is what sits above it.
	{ href: '/calendar#race-calendar', label: 'Race Calendar' },
];

export const SOCIAL_LINKS = {
	facebook: 'https://www.facebook.com/groups/161908423862991/',
	strava: 'https://www.strava.com/clubs/246805/leaderboard',
};

export const ENGLAND_ATHLETICS_URL = 'https://www.englandathletics.org/';

// The club's Google Calendar, shown on /calendar above the race diary.
//
// A STOPGAP, and agreed as one. The intended version reads the calendar's .ics
// feed at build time and renders real HTML: styled like the rest of the site,
// working without JavaScript, and with no request to Google from a visitor's
// browser. The weekly rebuild keeps it current. That work is blocked on access
// to the club Google account, so this embed stands in until it lands. Prefer
// finishing the .ics version over investing in this one.
//
// The calendar's ID, not an embed URL — find it in Google Calendar under
// Settings > (the calendar) > Integrate calendar. It looks like an email
// address. The calendar must be set to "Make available to public" or the
// embed shows a permission error to everyone who is not signed in to it.
//
// Empty until somebody sets it, and the page renders the race diary alone
// rather than an iframe that cannot load. Do not guess a value here.
//
// PRIVACY: this is a third-party embed. Every visitor to /calendar would make
// a request to Google, which is the thing self-hosting the fonts was meant to
// avoid. Setting this needs a line on the privacy page, and it would be the
// one place on the site where a visitor's IP reaches Google. That is the whole
// reason the .ics version is the one to build.
export const GOOGLE_CALENDAR_ID = '';
