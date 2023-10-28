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

const unorderdArray = [1, 3, 2, 7, 4];
const expectedArray = [1, 2, 3, 4, 7];
console.log({
	unorderdArray: [...unorderdArray],
	sortedArray: bubbleSort(unorderdArray),
	expectedArray,
});
