// A what3words reference is written in the content files the way the app
// shows it — ///word.word.word — and turned into a link here so editors
// never have to paste a URL.
const REFERENCE = /\/\/\/[a-z]+\.[a-z]+\.[a-z]+/g;

export interface TextPart {
	text: string;
	// Set only on the what3words references; plain prose has no href.
	href?: string;
}

// Splits prose into plain and linkable parts, in order, so a template can
// render the references as links without losing the text around them.
export function splitWhat3Words(text: string): TextPart[] {
	const parts: TextPart[] = [];
	let index = 0;

	for (const match of text.matchAll(REFERENCE)) {
		if (match.index > index) {
			parts.push({ text: text.slice(index, match.index) });
		}
		parts.push({
			text: match[0],
			href: `https://what3words.com/${match[0].slice(3)}`,
		});
		index = match.index + match[0].length;
	}

	if (index < text.length) {
		parts.push({ text: text.slice(index) });
	}

	return parts;
}
