// vim: noexpandtab

/**
 * Returns first index of found needle within order array, or error if needle was not found
 */
export function binarySearch<T>(array: T[], needle: T): number {
	let lo = 0;
	let hi = array.length;

	do {
		const middle_index = Math.floor(lo + (hi - lo) / 2);
		const middle_value = array[middle_index];

		if (middle_value === needle) {
			return middle_index;
		} else if (middle_value > needle) {
			hi = middle_index;
		} else {
			lo = middle_index + 1;
		}
	} while (lo < hi);

	throw new Error('Did not find needle in array');
}
