// vim: noexpandtab

/**
 *
 */
function qs<T>(array: T[], lo: number, hi: number): void {
	if (lo >= hi) {
		return;
	}

	const pivot_index = partition(array, lo, hi);
	qs(array, lo, pivot_index - 1);
	qs(array, pivot_index + 1, hi);
}

/**
 *
 */
function partition<T>(array: T[], lo: number, hi: number): number {
	// const partition_index = Math.floor((lo + hi) / 2);
	const partition_index = hi;
	const pivot_value = array[partition_index];

	let pivot_index = lo - 1;
	for (let i = lo; i < hi; ++i) {
		if (array[i] <= pivot_value) {
			pivot_index++;
			const tmp_value = array[i];
			array[i] = array[pivot_index];
			array[pivot_index] = tmp_value;
		}
	}

	pivot_index++;
	array[hi] = array[pivot_index];
	array[pivot_index] = pivot_value;

	return pivot_index;
}

/**
 *
 */
export function quickSort<T>(array: T[]): T[] {
	qs(array, 0, array.length - 1);
	return array;
}
