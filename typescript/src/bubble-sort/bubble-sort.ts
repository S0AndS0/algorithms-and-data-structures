// vim: noexpandtab

/**
 * Mutates and returns sorted array of numbers
 */
export function bubbleSort(array: number[]) {
	for (const i of array.keys()) {
		for (let j = 0; j < array.length - 1 - i; ++j) {
			const next_index = j + 1;
			if (array[j] > array[next_index]) {
				const tmp = array[j];
				array[j] = array[next_index];
				array[next_index] = tmp;
			}
		}
	}
	return array;
}
