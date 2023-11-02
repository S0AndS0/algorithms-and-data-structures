// vim: noexpandtab

import { Doubly_Linked_List } from '../doubly-linked-list/doubly-linked-list.js';

describe('Test doubly linked list data structure and behaviors', () => {
	it('Doubly_Linked_List.prepend correctly increments length and shifts values', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.prepend(item);
		}

		const expected = items.reverse().map((value, index) => {
			return { index, value };
		});

		for (const [index, value] of dll.entries()) {
			expect(index).toBe(expected[index].index);
			expect(value).toBe(expected[index].value);
		}
	});

	it('Doubly_Linked_List.insertAt throws out of bounds error for index greater than list length', () => {
		const dll = new Doubly_Linked_List();

		expect(() => {
			dll.insertAt('value', 42);
		}).toThrow('Index greater than list length');
	});

	it('Doubly_Linked_List.insertAt throws out of bounds error for index less than zero', () => {
		const dll = new Doubly_Linked_List();

		expect(() => {
			dll.insertAt('value', -1);
		}).toThrow('Index is negative or NaN');
	});

	it('Doubly_Linked_List.insertAt appends to list when index is list length', () => {
		const dll = new Doubly_Linked_List();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.insertAt(item, dll.length);
		}

		for (const [index, item] of items.entries()) {
			expect(dll.get(index)).toBe(item);
		}
	});

	it('Doubly_Linked_List.insertAt prependd to list when index is zero', () => {
		const dll = new Doubly_Linked_List();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.insertAt(item, 0);
		}

		for (const [index, item] of items.reverse().entries()) {
			expect(dll.get(index)).toBe(item);
		}
	});

	it('Doubly_Linked_List.insertAt okay with inserting at middle of list', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		const expected = [];
		for (const item of items) {
			const index = Math.floor(dll.length / 2);
			dll.insertAt(item, index);
		}

		for (const [index, item] of dll.entries()) {
			const value = items.find((x) => x === item);
			expect(dll.get(index)).toBe(value);
		}
	});

	it('Doubly_Linked_List.append correctly increments length and adds values', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.append(item);
		}

		const expected = [...items.entries()].map(([index, value]) => {
			return { index, value };
		});

		for (const [index, value] of dll.entries()) {
			expect(index).toBe(expected[index].index);
			expect(value).toBe(expected[index].value);
		}
	});

	it('Doubly_Linked_List.remove throws errors for empty list', () => {
		const dll = new Doubly_Linked_List();

		expect(() => {
			dll.remove('foo');
		}).toThrow('List is empty');
	});

	it('Doubly_Linked_List.remove correctly decrements length and removes values', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.append(item);
		}

		let expected_length = dll.length;
		for (const value of items.sort(() => 0.5 - Math.random())) {
			expect(dll.remove(value)).toBe(value);
			expect(dll.length).toBe(--expected_length);
		}
	});

	it('Doubly_Linked_List.remove throws errors for non-existent item', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.append(item);
		}

		expect(() => {
			dll.remove(1337);
		}).toThrow('Value not in list');
	});

	it('Doubly_Linked_List.get correctly retrieves value at given index', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.append(item);
		}

		const expected = [...items.entries()].map(([index, value]) => {
			return { index, value };
		});

		for (const { index, value } of expected.sort(() => 0.5 - Math.random())) {
			expect(dll.get(index)).toBe(value);
		}
	});

	it('Doubly_Linked_List.removeAt correctly decrements length and removes values from tail of list', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.append(item);
		}

		const expected = [...items.entries()].map(([index, value]) => {
			return { index, value };
		});

		let expected_length = dll.length;
		for (const { index, value } of expected.reverse()) {
			expect(dll.removeAt(index)).toBe(value);
			expect(dll.length).toBe(--expected_length);
		}
	});

	it('Doubly_Linked_List.removeAt correctly decrements length and removes values from head of list', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.append(item);
		}

		let expected_length = dll.length;
		for (const [index, value] of items.entries()) {
			expect(dll.removeAt(index)).toBe(value);
			expect(dll.length).toBe(--expected_length);
			items.shift();
		}
	});

	it('Doubly_Linked_List.removeAt correctly decrements length and removes values from random indexes of list', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.append(item);
		}

		const expected = [...items.entries()]
			.map(([index, value]) => {
				return { index, value };
			})
			.sort(() => 0.5 - Math.random());

		let expected_length = dll.length;
		for (const { index, value } of expected) {
			expect(dll.removeAt(index)).toBe(value);
			expect(dll.length).toBe(--expected_length);

			expected.forEach((x) => {
				if (x.index > index) {
					x.index -= 1;
				}
			});
		}
	});

	it('Doubly_Linked_List.entries iterates over index/value pares', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.append(item);
		}

		const expected = [...items.entries()].map(([index, value]) => {
			return { index, value };
		});

		for (const [index, value] of dll.entries()) {
			expect(value).toBe(expected[index].value);
			expect(index).toBe(expected[index].index);
		}
	});

	it('Doubly_Linked_List.values iterates over values', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.append(item);
		}

		const iter = items.values();
		for (const value of dll.values()) {
			expect(value).toBe(iter.next().value);
		}
	});

	it('Doubly_Linked_List.getAt throws error for empty list', () => {
		const dll = new Doubly_Linked_List();

		expect(() => {
			dll.get(1337);
		}).toThrow('List is empty');
	});

	it('Doubly_Linked_List.getAt throws error when index is greater than list length', () => {
		const dll = new Doubly_Linked_List<number>();

		const limit = 10;

		const items = Array(limit)
			.fill(undefined)
			.map((_, i) => i + 10);

		for (const item of items) {
			dll.append(item);
		}

		expect(() => {
			dll.get(1337);
		}).toThrow('Index greater than list length');
	});
});
