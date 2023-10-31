// vim: noexpandtab

import { EmptyStack, SNode, Stack } from '../stack/stack.js';

describe('Test stack data structure and behaviors', () => {
	it('Stack.push correctly increments Stack.length', () => {
		const stack = new Stack();

		const limit = 3;

		for (let i = 0; i < limit; i++) {
			stack.push(i);
		}

		expect(stack.length).toBe(limit);
	});

	it('Stack.pop decrements length and returns values', () => {
		const stack = new Stack();

		const limit = 3;
		const expected_values = [];
		let expected_length = limit;

		for (let i = 0; i < limit; i++) {
			stack.push(i);
			expected_values.unshift(i);
		}

		for (let i = 0; i < limit; i++) {
			let value;
			try {
				value = stack.pop();
			} catch (error) {
				if (!(error instanceof EmptyStack)) {
					console.error('Unexpected error type ->', error);
				}
				console.error('Unexpected EmptyStack ->', error);

				throw error;
			}

			const expected_value = expected_values[i];
			expect(value).toBe(expected_value);

			expected_length--;
			expect(stack.length).toBe(expected_length);
		}
	});

	it('Stack.pop throws error when stack is empty', () => {
		const stack = new Stack();

		expect(() => {
			stack.pop();
		}).toThrow('Stack is empty');
	});

	it('Stack.peek returns expected value', () => {
		const stack = new Stack();
		const value = 3;

		stack.push(value);

		const peeked_value = stack.peek();

		expect(peeked_value).toBe(value);
	});

	it('Stack.peek throws error when stack is empty', () => {
		const stack = new Stack();

		expect(() => {
			stack.peek();
		}).toThrow('Stack is empty');
	});
});
