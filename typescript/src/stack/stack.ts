// vim: noexpandtab

export class EmptyStack extends Error {
	constructor(message?: string) {
		super(message);
	}
}

export class SNode<T> {
	value: T;
	prev?: SNode<T>;

	constructor(value: T) {
		this.value = value;
		this.prev = undefined;
	}
}

export class Stack<T> {
	public length: number;
	private head?: SNode<T>;

	constructor() {
		this.length = 0;
		this.head = undefined;
	}

	/**
	 *
	 */
	push(item: T) {
		const node = new SNode(item);

		this.length++;

		if (!this.head) {
			this.head = node;
			return;
		}

		node.prev = this.head;
		this.head = node;
	}

	/**
	 *
	 */
	pop(): T {
		if (!this.head) {
			throw new EmptyStack('Stack is empty');
		}

		this.length--;
		const head = this.head;
		this.head = head.prev;

		return head.value;
	}

	/**
	 * Returns value of stack without mutation
	 * @throws {EmptyStack} - If/when stack is empty
	 */
	peek(): T {
		if (this.head) {
			return this.head.value;
		}
		throw new EmptyStack('Stack is empty');
	}
}
