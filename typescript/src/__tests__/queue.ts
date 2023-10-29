// vim: noexpandtab

import { EmptyQueue, QNode, Queue } from '../queue/queue.js';

describe('Test queue data structure and behaviors', () => {
	it('Queue.enqueue correctly increments Queue.length', () => {
		const queue = new Queue();

		const limit = 3;

		for (let i = 0; i < limit; i++) {
			queue.enqueue(i);
		}

		expect(queue.length).toBe(limit);
	});

	it('Queue.deque decrements length and returns values', () => {
		const queue = new Queue();

		const limit = 3;
		const expected_values = [];
		let expected_length = limit;

		for (let i = 0; i < limit; i++) {
			queue.enqueue(i);
			expected_values.push(i);
		}

		for (let i = 0; i < limit; i++) {
			let value;
			try {
				value = queue.deque();
			} catch (error) {
				if (!(error instanceof EmptyQueue)) {
					console.error('Unexpected error type ->', error);
				}
				console.error('Unexpected EmptyQueue ->', error);

				throw error;
			}

			const expected_value = expected_values[i];
			expect(value).toBe(expected_value);

			expected_length--;
			expect(queue.length).toBe(expected_length);
		}
	});

	it('Queue.deque throws error when queue is empty', () => {
		const queue = new Queue();

		expect(() => {
			queue.deque();
		}).toThrow('Queue is empty');
	});

	it('Queue.peek returns expected value', () => {
		const queue = new Queue();
		const value = 3;

		queue.enqueue(value);

		const peeked_value = queue.peek();

		expect(peeked_value).toBe(value);
	});

	it('Queue.peek throws error when queue is empty', () => {
		const queue = new Queue();

		expect(() => {
			queue.peek();
		}).toThrow('Queue is empty');
	});
});
