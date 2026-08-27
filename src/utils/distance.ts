interface Distance {
	value: number;
	unit: "km" | "mi";
}

// distance is { value, unit } rather than a string so a site-wide mi/km
// switch can convert it later — always render through this, never raw.
export function formatDistance(distance: Distance): string {
	const value = Number.isInteger(distance.value) ? distance.value : distance.value.toFixed(1);
	return `${value}${distance.unit}`;
}
