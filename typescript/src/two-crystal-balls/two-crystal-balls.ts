// vim: noexpandtab

/**
 * Find index in sorted array in O(√n) running time
 */
export function twoCrystalBalls<T = boolean>(breaks: T[], target: T): number {
	const jump_ammount = Math.floor(Math.sqrt(breaks.length));

	let i = jump_ammount;
	for (; i < breaks.length; i += jump_ammount) {
		if (breaks[i] === target) {
			break;
		}
	}

	i -= jump_ammount;

	for (let j = 0; j < jump_ammount && i < breaks.length; ++j, ++i) {
		if (breaks[i] === target) {
			return i;
		}
	}

	throw new Error('Target does not exist in list');
}
