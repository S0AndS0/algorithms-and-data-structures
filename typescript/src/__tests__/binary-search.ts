// vim: noexpandtab

import { binarySearch } from '../binary-search/binary-search.js';

describe('Test binary search implmentation', () => {
	it('Finds index of high needle', () => {
		const limit = 10;
		const haystack = Array(limit)
			.fill(undefined)
			.map((_, i) => i);

		const expected_index = haystack[limit - 2];
		const needle = haystack[expected_index];

		const found_index = binarySearch(haystack, needle);

		expect(found_index).toBe(expected_index);
	});

	it('Finds index of low needle', () => {
		const limit = 10;
		const haystack = Array(limit)
			.fill(undefined)
			.map((_, i) => i);

		const expected_index = haystack[2];
		const needle = haystack[expected_index];

		const found_index = binarySearch(haystack, needle);

		expect(found_index).toBe(expected_index);
	});

	it('Throws an error if needle is not found', () => {
		const limit = 10;
		const haystack = Array(limit)
			.fill(undefined)
			.map((_, i) => i);

		const needle = limit + 2;

		expect(() => {
			binarySearch(haystack, needle);
		}).toThrow('Did not find needle in array');
	});
});
