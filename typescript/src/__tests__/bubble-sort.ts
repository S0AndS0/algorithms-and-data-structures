// vim: noexpandtab

// import { describe, it } from 'node:test';
// import assert from 'node:assert';

import { bubbleSort } from '../bubble-sort/bubble-sort.js';

describe('Test bubble sort', () => {
	it('Sorts some numbers', () => {
		const unorderdArray = [1, 3, 2, 7, 4];
		const expectedArray = [1, 2, 3, 4, 7];
		console.log({
			unorderdArray,
			expectedArray,
		});

		// assert.deepEqual(bubbleSort(unorderdArray), expectedArray, 'Failed to sort');
		expect(bubbleSort(unorderdArray)).toStrictEqual(expectedArray);
	});
});
