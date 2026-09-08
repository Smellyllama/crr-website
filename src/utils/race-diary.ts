// Turning a race diary rule into a date, and into words.
//
// The single path for both, the way getEarliestRaceDate is for race reports.
// Nothing else should be working out when a race falls.
//
// Everything is computed in UTC. Frontmatter dates arrive as UTC midnight, and
// mixing those with local-time arithmetic is how a race lands on the wrong day
// for anyone west of Greenwich.

export type Nth = "first" | "second" | "third" | "fourth" | "last";
export type Weekday =
	| "Monday"
	| "Tuesday"
	| "Wednesday"
	| "Thursday"
	| "Friday"
	| "Saturday"
	| "Sunday";

export interface DiaryRule {
	month: number;
	fixedDate?: string;
	nth?: Nth;
	weekday?: Weekday;
	status?: "confirmed" | "expected";
	confirmedDate?: Date;
}

const WEEKDAY_INDEX: Record<Weekday, number> = {
	Sunday: 0,
	Monday: 1,
	Tuesday: 2,
	Wednesday: 3,
	Thursday: 4,
	Friday: 5,
	Saturday: 6,
};

const MONTH_NAMES = [
	"January", "February", "March", "April", "May", "June",
	"July", "August", "September", "October", "November", "December",
];

const NTH_WORDS: Record<Nth, string> = {
	first: "first",
	second: "second",
	third: "third",
	fourth: "fourth",
	last: "last",
};

/** The nth given weekday of a month, e.g. the last Sunday in November 2026. */
export function resolveRule(year: number, month: number, nth: Nth, weekday: Weekday): Date {
	const target = WEEKDAY_INDEX[weekday];

	if (nth === "last") {
		// Walk back from the last day of the month to the first matching weekday.
		const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
		const date = new Date(Date.UTC(year, month - 1, lastDay));
		date.setUTCDate(lastDay - ((date.getUTCDay() - target + 7) % 7));
		return date;
	}

	// Forward from the 1st to the first matching weekday, then whole weeks on.
	const first = new Date(Date.UTC(year, month - 1, 1));
	const offset = (target - first.getUTCDay() + 7) % 7;
	const week = { first: 0, second: 1, third: 2, fourth: 3 }[nth];
	return new Date(Date.UTC(year, month - 1, 1 + offset + week * 7));
}

/** "1 January" for a given year. Returns undefined if it cannot be parsed. */
export function resolveFixedDate(year: number, fixedDate: string): Date | undefined {
	const match = fixedDate.trim().match(/^(\d{1,2})\s+([A-Za-z]+)$/);
	if (!match) return undefined;
	const day = Number(match[1]);
	const month = MONTH_NAMES.findIndex((m) => m.toLowerCase() === match[2].toLowerCase());
	if (month < 0) return undefined;
	return new Date(Date.UTC(year, month, day));
}

/** Where this entry falls in a given year. Used for ordering. */
export function occurrenceIn(entry: DiaryRule, year: number): Date | undefined {
	if (entry.fixedDate) return resolveFixedDate(year, entry.fixedDate);
	if (entry.nth && entry.weekday) return resolveRule(year, entry.month, entry.nth, entry.weekday);
	return undefined;
}

/**
 * The next time this race comes round, on or after `from`.
 *
 * A confirmed date wins outright — somebody checked it. Otherwise this year's
 * occurrence if it is still ahead, and next year's if it has been and gone.
 */
export function nextOccurrence(entry: DiaryRule, from: Date): Date | undefined {
	if (entry.confirmedDate) return entry.confirmedDate;
	const thisYear = occurrenceIn(entry, from.getUTCFullYear());
	if (thisYear && thisYear >= startOfDay(from)) return thisYear;
	return occurrenceIn(entry, from.getUTCFullYear() + 1);
}

const startOfDay = (d: Date): Date =>
	new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));

/**
 * Whether a specific day may be shown.
 *
 * Only two things earn one: a date a human confirmed with the organiser, and a
 * fixed date that cannot drift because it is the same every year. A date
 * computed from a rule never does, however plausible it looks — the rule came
 * from one observation, and a member turning up a week late is a worse outcome
 * than a page admitting it does not know.
 */
export function hasExactDate(entry: DiaryRule): boolean {
	if (entry.fixedDate) return true;
	return entry.status === "confirmed" && Boolean(entry.confirmedDate);
}

/** How to say when this race happens, when no exact date may be shown. */
export function describeTiming(entry: DiaryRule): string {
	const month = MONTH_NAMES[entry.month - 1];
	if (entry.nth && entry.weekday) {
		return `usually the ${NTH_WORDS[entry.nth]} ${entry.weekday} in ${month}`;
	}
	return `expected in ${month}`;
}

/** Twelve months from the month `from` falls in, oldest first. */
export function diaryWindow(from: Date, months = 12): { year: number; month: number }[] {
	const out: { year: number; month: number }[] = [];
	for (let i = 0; i < months; i += 1) {
		const d = new Date(Date.UTC(from.getUTCFullYear(), from.getUTCMonth() + i, 1));
		out.push({ year: d.getUTCFullYear(), month: d.getUTCMonth() + 1 });
	}
	return out;
}

export const monthName = (month: number): string => MONTH_NAMES[month - 1];
