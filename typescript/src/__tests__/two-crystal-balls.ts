// vim: noexpandtab

import { twoCrystalBalls } from '../two-crystal-balls.js';

describe('Test two crystal balls search algorithm', () => {
	it('Finds the index where values switch to target', () => {
		const limit = 10000;
		let index = Math.floor(Math.random() * limit);
		const haystack = new Array(limit).fill(false);

		const target = true;

		for (let i = index; i < limit; ++i) {
			haystack[i] = target;
		}

		expect(twoCrystalBalls(haystack, target)).toEqual(index);
	});

	it('Throws error if no index is found for target', () => {
		const limit = 10000;
		const haystack = new Array(limit).fill(false);

		const target = true;

		expect(() => {
			twoCrystalBalls(haystack, target);
		}).toThrow('Target does not exist in list');
	});
});
