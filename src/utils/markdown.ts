import { createMarkdownProcessor } from '@astrojs/markdown-remark';

/**
 * Render a frontmatter string as Markdown.
 *
 * Astro renders the BODY of a Markdown file for you, but a frontmatter field is
 * just a string — so a committee member writing a bulleted list into one gets
 * the hyphens printed and the line breaks swallowed. That is what happened to
 * the Tuesday club night: four group distances, written as a list, rendered as
 * one run-on sentence on the homepage.
 *
 * This is the same processor Astro uses for .md files, already a dependency of
 * Astro itself, so the output matches the rest of the site and nothing new was
 * installed for it.
 *
 * Built once and reused. Creating a processor is not cheap and these fields are
 * rendered on every page build.
 */
let processor: Awaited<ReturnType<typeof createMarkdownProcessor>> | undefined;

export async function renderMarkdown(text: string): Promise<string> {
	if (!text) return '';
	processor ??= await createMarkdownProcessor({});
	const { code } = await processor.render(text);
	return code;
}
