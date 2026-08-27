import { getCollection } from 'astro:content';
import rss from '@astrojs/rss';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { getEarliestRaceDate } from '../utils/race-reports';

export async function GET(context) {
	const posts = await getCollection('race-reports', ({ data }) => !data.draft);
	return rss({
		title: SITE_TITLE,
		description: SITE_DESCRIPTION,
		site: context.site,
		items: posts.map((post) => ({
			title: post.data.title,
			description: post.data.excerpt,
			pubDate: getEarliestRaceDate(post.data.races),
			link: `/race-reports/${post.id}/`,
		})),
	});
}
