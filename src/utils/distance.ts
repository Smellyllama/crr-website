export type Unit = "km" | "mi";

interface Distance {
	value: number;
	unit: Unit;
}

const KM_PER_MILE = 1.609344;

/** The unit shown to anyone who has not chosen one. */
export const DEFAULT_UNIT: Unit = "mi";

/** localStorage key and the attribute set on <html>. Shared so they cannot drift. */
export const UNIT_STORAGE_KEY = "crr-units";
export const UNIT_ATTRIBUTE = "data-units";

const convert = (distance: Distance, to: Unit): number => {
	if (distance.unit === to) return distance.value;
	return to === "mi" ? distance.value / KM_PER_MILE : distance.value * KM_PER_MILE;
};

// Whole numbers stay whole — a 10k reads "10km", not "10.0km". Anything else
// gets one decimal, which is how race distances are quoted (13.1mi, 26.2mi).
const round = (value: number): string =>
	Number.isInteger(value) ? String(value) : value.toFixed(1);

/**
 * distance is { value, unit } rather than a string so it can be converted —
 * always render through here, never raw.
 */
export function formatDistance(distance: Distance, unit: Unit = distance.unit): string {
	return `${round(convert(distance, unit))}${unit}`;
}

/**
 * Both units for one distance. The page renders both and CSS shows whichever
 * the reader has chosen, so switching needs no round trip and nothing moves
 * on the page as it happens.
 */
export function formatBothUnits(distance: Distance): Record<Unit, string> {
	return { mi: formatDistance(distance, "mi"), km: formatDistance(distance, "km") };
}
