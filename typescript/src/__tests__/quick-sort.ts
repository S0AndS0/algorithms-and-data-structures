// vim: noexpandtab

import { quickSort } from '../quick-sort/quick-sort.js';

describe('Test bubble sort', () => {
	it('Sorts some numbers', () => {
		const unorderdArray = [1, 3, 2, 7, 4];
		const expectedArray = [1, 2, 3, 4, 7];

		expect(quickSort(unorderdArray)).toStrictEqual(expectedArray);
	});
});
