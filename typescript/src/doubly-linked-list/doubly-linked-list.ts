// vim: noexpandtab

export class EmptyDLL extends Error {
	constructor(message: string | undefined = 'List is empty') {
		super(message);
	}
}

export class IndexOutOfBoundsDLL extends Error {
	constructor(message: string | undefined = 'Index greater than list length') {
		super(message);
	}
}

export class DoesNotContainValueInDLL extends Error {
	constructor(message: string | undefined = 'Value not in list') {
		super(message);
	}
}

export class DLNode<T> {
	public value: T;
	public next?: DLNode<T>;
	public prev?: DLNode<T>;

	constructor(item: T) {
		this.value = item;
		this.next = undefined;
		this.prev = undefined;
	}
}

export class Doubly_Linked_List<T> {
	public length: number;
	private head?: DLNode<T>;
	private tail?: DLNode<T>;

	constructor() {
		this.length = 0;
		this.head = undefined;
		this.tail = undefined;
	}

	/**
	 * Insert item at head of list
	 */
	prepend(item: T): void {
		const node = new DLNode(item);

		this.length++;
		if (!this.head) {
			this.head = node;
			this.tail = node;
			return;
		}

		// Attach node to list
		node.next = this.head;
		// Attach list to node
		this.head.prev = node;
		this.head = node;
	}

	/**
	 * Traverse list to target index and insert item
	 * @throws {IndexOutOfBoundsDLL} when index is greater than list length
	 */
	insertAt(item: T, index: number): void {
		if (index > this.length) {
			throw new IndexOutOfBoundsDLL();
		} else if (index < 0) {
			throw new IndexOutOfBoundsDLL('Index is negative or NaN');
		} else if (index === this.length) {
			return this.append(item);
		} else if (index === 0) {
			return this.prepend(item);
		}

		const curr = this.getAt(index);

		this.length++;
		const node = new DLNode(item);

		// Attach new node to list
		node.next = curr;
		node.prev = curr.prev;

		// Attach list to node
		curr.prev = node;
		if (node.prev) {
			node.prev.next = node;
		}
	}

	/**
	 * Insert node at tail of list
	 */
	append(item: T): void {
		const node = new DLNode(item);

		this.length++;
		if (!this.tail) {
			this.head = node;
			this.tail = node;
			return;
		}

		// Attach new node to list
		node.prev = this.tail;

		// Attach list to node
		this.tail.next = node;
		this.tail = node;
	}

	/**
	 * Traverse list, from head to tail, and remove first node with matching value
	 * @throws {EmptyDLL} if list is empty
	 * @throws {DoesNotContainValueInDLL} if value is not found in list
	 */
	remove(item: T): T {
		if (this.length === 0) {
			throw new EmptyDLL();
		}

		for (const [_index, node] of this.traverseForward()) {
			if (item === node.value) {
				return this.removeNode(node);
			}
		}

		throw new DoesNotContainValueInDLL();
	}

	/**
	 * Traverse list and attempt to retrieve value at given index
	 */
	get(index: number): T {
		return this.getAt(index).value;
	}

	/**
	 * Traverse list and attempt to remove node at given index
	 */
	removeAt(index: number): T {
		const node = this.getAt(index);
		return this.removeNode(node);
	}

	/**
	 * Iterate from head to tail yielding tuples of index and value of nodes
	 */
	*entries(): IterableIterator<[number, T]> {
		for (const [index, node] of this.traverseForward()) {
			yield [index, node.value];
		}
	}

	/**
	 * Iterate from head to tail yielding value of nodes
	 */
	*values() {
		for (const [_, node] of this.traverseForward()) {
			yield node.value;
		}
	}

	/**
	 * Iterate from head to tail yielding tuples of index and nodes
	 */
	private *traverseForward(): IterableIterator<[number, DLNode<T>]> {
		let node = this.head;
		for (let i = 0; i < this.length; i++) {
			yield [i, node as DLNode<T>];
			node = (node as DLNode<T>).next;
		}
	}

	/**
	 * Iterate from tail to head yielding tuples of index and nodes
	 */
	private *traverseBackword(): IterableIterator<[number, DLNode<T>]> {
		let node = this.tail;
		for (let i = this.length - 1; i >= 0; i--) {
			yield [i, node as DLNode<T>];
			node = (node as DLNode<T>).prev;
		}
	}

	/**
	 * Return value of node after updating connections and list pointers
	 * @note - Callers must preform bounds checks or return value checks
	 */
	private removeNode(node: DLNode<T>): T {
		this.length--;
		if (this.length === 0) {
			this.head = undefined;
			this.tail = undefined;
			return node.value;
		}

		// Update preexisting connections to _jump_ over node
		if (node.prev) {
			node.prev.next = node.next;
		}
		if (node.next) {
			node.next.prev = node.prev;
		}

		// Update ends of list
		if (node === this.head) {
			this.head = node.next;
		}
		if (node === this.tail) {
			this.tail = node.prev;
		}

		// Free memory
		node.next = undefined;
		node.prev = undefined;

		return node.value;
	}

	/**
	 * Traverse list from end closest to target index
	 * @throws {EmptyDLL} if list is empty
	 * @throws {IndexOutOfBoundsDLL} when index is greater than list length
	 */
	private getAt(index: number): DLNode<T> {
		if (this.length === 0) {
			throw new EmptyDLL();
		} else if (index > this.length) {
			throw new IndexOutOfBoundsDLL();
		}

		/* prettier-ignore */
		const iterator = index < Math.floor(this.length / 2)
			? this.traverseForward()
			: this.traverseBackword()

		for (const [i, node] of iterator) {
			if (i === index) {
				return node;
			}
		}

		/* istanbul ignore next */
		throw new Error('Oh no!');
	}
}
