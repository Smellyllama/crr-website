import type { CollectionEntry } from "astro:content";

type RaceReport = CollectionEntry<"race-reports">;
type Race = RaceReport["data"]["races"][number];
type Distance = NonNullable<Race["distance"]>;

// The only date a race report is ordered by. There is no top-level `date`
// field on purpose — a post can cover several races on different days, so
// this is the single source of truth for "when did this post happen".
export function getEarliestRaceDate(races: Race[]): Date {
	return races.reduce(
		(earliest, race) => (race.raceDate < earliest ? race.raceDate : earliest),
		races[0].raceDate,
	);
}

export function sortByRaceDateDesc(posts: RaceReport[]): RaceReport[] {
	return [...posts].sort(
		(a, b) => getEarliestRaceDate(b.data.races).valueOf() - getEarliestRaceDate(a.data.races).valueOf(),
	);
}

// True when every race in the post fell on the same calendar day, so the
// date only needs to be shown once instead of once per race.
export function allRacesSameDay(races: Race[]): boolean {
	return races.every((race) => isSameDay(race.raceDate, races[0].raceDate));
}

function isSameDay(a: Date, b: Date): boolean {
	return (
		a.getUTCFullYear() === b.getUTCFullYear() &&
		a.getUTCMonth() === b.getUTCMonth() &&
		a.getUTCDate() === b.getUTCDate()
	);
}

// Only worth showing the "posted" line when it lands on a later calendar
// day than the race itself — same-day write-ups don't need a second date.
export function postedIsMeaningfullyLater(posted: Date | undefined, earliestRaceDate: Date): boolean {
	if (!posted) return false;
	return !isSameDay(posted, earliestRaceDate) && posted > earliestRaceDate;
}

// distance is { value, unit } rather than a string so a site-wide mi/km
// switch can convert it later — always render through this, never raw.
export function formatDistance(distance: Distance): string {
	const value = Number.isInteger(distance.value) ? distance.value : distance.value.toFixed(1);
	return `${value}${distance.unit}`;
}
