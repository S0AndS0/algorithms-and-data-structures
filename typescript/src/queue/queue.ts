// vim: noexpandtab

export class EmptyQueue extends Error {
	constructor(message?: string) {
		super(message);
	}
}

export class QNode<T> {
	public value: T;
	public next?: QNode<T>;

	constructor(item: T) {
		this.value = item;
	}
}

export class Queue<T> {
	public length: number;
	private head?: QNode<T>;
	private tail?: QNode<T>;

	constructor() {
		this.length = 0;
		this.head = undefined;
		this.tail = undefined;
	}

	/**
	 * Appends item to end of queue
	 */
	enqueue(item: T) {
		const node = new QNode(item);

		this.length++;

		if (!this.tail) {
			this.tail = node;
			this.head = node;
			return;
		}

		this.tail.next = node;
		this.tail = node;
	}

	/**
	 * Removes and returns first item of queue or an error
	 * @throws {EmptyQueue} - If/when queue is empty
	 */
	deque(): T {
		if (!this.head) {
			throw new EmptyQueue('Queue is empty');
		}

		this.length--;

		const head = this.head;
		this.head = this.head.next;

		// free
		head.next = undefined;

		return head.value;
	}

	/**
	 * Returns first value of queue without mutation
	 * @throws {EmptyQueue} - If/when queue is empty
	 */
	peek(): T | undefined {
		if (this.head) {
			return this.head.value;
		}
		throw new EmptyQueue('Queue is empty');
	}
}
