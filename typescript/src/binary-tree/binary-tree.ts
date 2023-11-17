// vim: noexpandtab

/**
 * @template T
 * @type As_Object
 * @property {T} item - Value stored by object
 * @property {Object} children - Pointers to nested data
 * @property {As_Object<T>|undefined} children.left - Nested data
 * @property {As_Object<T>|undefined} children.right - Nested data
 */
type As_Object<T> = {
	item?: T;
	children?: {
		left?: As_Object<T>;
		right?: As_Object<T>;
	};
};

/***/
export class BTNode<T> {
	value: T;
	parent: BTNode<T> | undefined;
	height: number;
	children: {
		left?: BTNode<T>;
		right?: BTNode<T>;
	};

	constructor(item: T) {
		this.value = item;
		this.parent = undefined;
		this.height = 0;
		this.children = {
			left: undefined,
			right: undefined,
		};
	}

	/**
	 * Implicitly called by `JSON.stringify`, which expects an Object of possibly
	 * nested primitive values.
	 *
	 * @returns {As_Object|string}
	 *
	 * @notes
	 *
	 * - If called by `JSON.stringify`, then `args` will be `[ '' ]`, and return
	 *   value should be an Object
	 * - If called directly, then `args` _should_ be `[]`, and return value will
	 *   be a JSON formatted string
	 */
	toJSON(...args: any[]): As_Object<T> | string {
		const result = this.toObject(this, {} as As_Object<T>);
		if (args.length) {
			return result;
		}
		return JSON.stringify(result);
	}

	/**
	 * Convert series of nodes into generic Object
	 *
	 * @returns {As_Object}
	 */
	toObject(curr: BTNode<T> | undefined = this, accumulator: As_Object<T> = {}): As_Object<T> {
		return this._toObject(curr, accumulator);
	}

	/**
	 *
	 */
	private _toObject(curr: BTNode<T> | undefined, accumulator: As_Object<T>): As_Object<T> {
		if (!curr || curr.value === undefined) {
			return accumulator;
		}

		accumulator.item = curr.value;
		accumulator.children = {};

		const left = this._toObject(curr.children.left, {});
		const right = this._toObject(curr.children.right, {});

		if (Object.keys(left).length) {
			accumulator.children.left = left;
		}

		if (Object.keys(right).length) {
			accumulator.children.right = right;
		}

		if (!Object.keys(left).length && !Object.keys(right).length) {
			delete accumulator.children;
		}

		return accumulator;
	}

	/**
	 *
	 */
	static fromObject<T>(object: As_Object<T>): BTNode<T> {
		return BTNode._fromObject(object, new (this as typeof BTNode)(undefined) as BTNode<T>);
	}

	private static _fromObject<T>(object: As_Object<T> | undefined, node: BTNode<T>): BTNode<T> {
		// base case
		if (!object || object.item === undefined) {
			return node;
		}

		node.value = object.item;

		// recurs
		if (object.children && Object.keys(object.children).length) {
			if (object.children.left) {
				node.children.left = (this as typeof BTNode)._fromObject(
					object.children.left,
					new (this as typeof BTNode)(undefined) as BTNode<T>
				);

				node.children.left.parent = node;
			}

			if (object.children.right) {
				node.children.right = (this as typeof BTNode)._fromObject(
					object.children.right,
					new (this as typeof BTNode)(undefined) as BTNode<T>
				);

				node.children.right.parent = node;
			}

			const child_max_hight = Math.max(
				node.children?.left?.height || 0,
				node.children?.right?.height || 0
			);
			node.height = child_max_hight + 1;
		}

		return node;
	}

	/**
	 * Attempt to create deep clone of node values
	 *
	 * @notes
	 * - this makes use of `structuredClone` which may not be available on all platforms
	 */
	clone(): BTNode<T> {
		const object = structuredClone(this.toObject());
		return (this.constructor as typeof BTNode<T>).fromObject(object);
	}
}

/**
 *
 */
export class Binary_Tree<T> {
	private root: BTNode<T> | undefined;

	constructor(root: BTNode<T> | T) {
		if (root instanceof BTNode) {
			this.root = root;
		} else {
			this.root = new BTNode(root);
		}
	}

	/**
	 * Mutates `o.path` by pushing values from recursing `o.curr`
	 *
	 * @template T
	 *
	 * @param {Object} o - Labeled arguments
	 * @param {BTNode<T>} [o.curr=this.root] - Node that will have children recursed
	 * @param {T[]} [o.path=T[]] - List of values found while walking
	 *
	 * @returns {T[]}
	 *
	 * @example
	 *
	 * ```javascript
	 * const binary_tree = new Binary_Tree();
	 *
	 * // ... do stuff...
	 *
	 * const path = binary_tree.walkPreOrder({ path: [] });
	 * console.log('binary_tree.walkPreOrderi ->', { path });
	 * //> [ 7, 23, 5, 4, 3, 18, 21 ]
	 * ```
	 */
	walkPreOrder({ curr, path } = { curr: this.root, path: [] }): T[] {
		return this._walkPreOrder({ curr, path });
	}

	private _walkPreOrder({ curr, path }: { curr?: BTNode<T> | undefined; path: T[] }): T[] {
		// base case
		if (!curr) {
			return path;
		}

		// recurs
		// pre
		path.push(curr.value);

		// recurs
		this._walkPreOrder({ curr: curr.children?.left, path });
		this._walkPreOrder({ curr: curr.children?.right, path });

		// post
		return path;
	}

	/**
	 * Allows for early termination of recursion by yielding values from `node`
	 *
	 * @param {BTNode<T>} [node=this.root] - Pointer to node that will be recursed
	 *
	 * @yields {T}
	 */
	*iterPreOrder(node: BTNode<T> | undefined = this.root): Generator<T, void, unknown> {
		if (!(node instanceof BTNode)) {
			throw new TypeError('Node not an instance of BTNode');
		}

		yield node.value;

		if (node.children.left) {
			yield* this.iterPreOrder(node.children.left);
		}

		if (node.children.right) {
			yield* this.iterPreOrder(node.children.right);
		}
	}

	/**
	 * Mutates `o.path` by pushing values from recursing `o.curr`
	 *
	 * @template T
	 *
	 * @param {Object} o - Labeled arguments
	 * @param {BTNode<T>} [o.curr=this.root] - Node that will have children recursed
	 * @param {T[]} [o.path=T[]] - List of values found while walking
	 *
	 * @returns {T[]} after pushing values onto `o.path`
	 *
	 * @example
	 *
	 * ```javascript
	 * const binary_tree = new Binary_Tree();
	 *
	 * // ... do stuff...
	 *
	 * const path = binary_tree.walkInOrder({ path: [] });
	 * console.log('binary_tree.walkInOrder ->', { path });
	 * //> [ 5, 23, 4, 7, 18, 3, 21 ]
	 * ```
	 */
	walkInOrder({ curr, path } = { curr: this.root, path: [] }): T[] {
		return this._walkInOrder({ curr, path });
	}

	/**
	 * @notes
	 *
	 * - The redirection between `this.walkInOrder` and `this._walkInOrder`
	 *   allows for setting defaults without cluttering-up the base case
	 */
	private _walkInOrder({ curr, path }: { curr?: BTNode<T> | undefined; path: T[] }): T[] {
		// base case
		if (!curr) {
			return path;
		}

		// recurs
		// pre

		// recurs
		this._walkInOrder({ curr: curr.children?.left, path });
		path.push(curr.value);
		this._walkInOrder({ curr: curr.children?.right, path });

		// post
		return path;
	}

	/**
	 * Allows for early termination of recursion by yielding values from `node`
	 *
	 * @param {BTNode<T>} [node=this.root] - Pointer to node that will be recursed
	 *
	 * @yields {T}
	 */
	*iterInOrder(node: BTNode<T> | undefined = this.root): Generator<T, void, unknown> {
		if (!(node instanceof BTNode)) {
			throw new TypeError('Node not an instance of BTNode');
		}

		if (node.children.left) {
			yield* this.iterInOrder(node.children.left);
		}

		yield node.value;

		if (node.children.right) {
			yield* this.iterInOrder(node.children.right);
		}
	}

	/**
	 * Mutates `o.path` by pushing values from recursing `o.curr`
	 *
	 * @template T
	 *
	 * @param {Object} o - Labeled arguments
	 * @param {BTNode<T>} [o.curr=this.root] - Node that will have children recursed
	 * @param {T[]} [o.path=T[]] - List of values found while walking
	 *
	 * @returns {T[]}
	 *
	 * @example
	 *
	 * ```javascript
	 * const binary_tree = new Binary_Tree();
	 *
	 * // ... do stuff...
	 *
	 * const path = binary_tree.walkPostOrder({ path: [] });
	 * console.log('binary_tree.walkPostOrder ->', { path });
	 * //> [ 5, 4, 23, 18, 21, 3, 7 ]
	 * ```
	 */
	walkPostOrder({ curr, path } = { curr: this.root, path: [] }): T[] {
		return this._walkPostOrder({ curr, path });
	}

	/**
	 * @notes
	 *
	 * - The redirection between `this.walkPostOrder` and `this._walkPostOrder`
	 *   allows for setting defaults without cluttering-up the base case
	 */
	private _walkPostOrder({ curr, path }: { curr?: BTNode<T>; path: T[] }): T[] {
		// base case
		if (!curr) {
			return path;
		}

		// recurs
		// pre

		// recurs
		this._walkPostOrder({ curr: curr.children.left, path });
		this._walkPostOrder({ curr: curr.children.right, path });

		// // post
		path.push(curr.value);
		return path;
	}

	/**
	 * Allows for early termination of recursion by yielding values from `node`
	 *
	 * @param {BTNode<T>} [node=this.root] - Pointer to node that will be recursed
	 *
	 * @yields {T}
	 */
	*iterPostOrder(node: BTNode<T> | undefined = this.root): Generator<T, void, unknown> {
		if (!(node instanceof BTNode)) {
			throw new TypeError('Node not an instance of BTNode');
		}

		if (node.children.left) {
			yield* this.iterPostOrder(node.children.left);
		}

		if (node.children.right) {
			yield* this.iterPostOrder(node.children.right);
		}

		yield node.value;
	}

	/**
	 * Recursively, depth first search, comparison of two trees and check both shape and values are the same
	 *
	 * @param {Object} o - Labeled arguments
	 * @param {BTNode<T>} [o.curr=this.root] - Pointer to node that will be compared with `o.other`
	 * @param {BTNode<T>|undefined} - Pointer to node that will be compared with `o.curr`
	 *
	 * @returns {boolean}
	 *
	 * @see {@link https://frontendmasters.com/courses/algorithms/implement-binary-tree-comparison/}
	 */
	compareShapeAndValues({
		curr = this.root,
		other = undefined,
	}: { curr?: BTNode<unknown>; other?: BTNode<unknown> } = {}): boolean {
		return this._compareShapeAndValues({ curr, other });
	}

	private _compareShapeAndValues({
		curr,
		other,
	}: {
		curr?: BTNode<unknown>;
		other?: BTNode<unknown>;
	}): boolean {
		// base case(s)
		if (curr === undefined && other === undefined) {
			/* Hit terminus node of both trees */
			return true;
		} else if (curr === undefined || other === undefined) {
			/* Hit terminus node of only one tree */
			return false;
		} else if (curr.value !== other.value) {
			return false;
		}

		// recurs
		return (
			this._compareShapeAndValues({
				curr: curr.children.left,
				other: other.children.left,
			}) &&
			this._compareShapeAndValues({
				curr: curr.children.right,
				other: other.children.right,
			})
		);
	}

	/**
	 * Breadth first searching assumes nodes are sorted with values in ascending
	 * order, left to right
	 *
	 * @notes
	 *
	 * - Running time is measured as a range between `O(log n)` to `O(n)`
	 * - Running time may be shortened to `O(h)` where `h` is tree height
	 */
	quickFind(item: T): boolean {
		return this._quickFind(item, this.root);
	}

	private _quickFind(item: T, curr?: BTNode<T>): boolean {
		// base case
		if (!curr) {
			return false;
		}

		if (item === curr.value) {
			return true;
		}

		// recurs
		if (curr.value < item) {
			return this._quickFind(item, curr.children.right);
		} else {
			return this._quickFind(item, curr.children.left);
		}
	}

	/**
	 * Depth first insertion assumes nodes are sorted with values in ascending
	 * order, left to right
	 */
	insert(item: T) {
		return this._insert(item, this.root as BTNode<T>);
	}

	private _insert(item: T, curr: BTNode<T>) {
		// assume `curr.value >= item`
		let label = 'left' as keyof BTNode<T>['children'];
		if (curr.value < item) {
			label = 'right';
		}

		if (curr.children[label]) {
			// recurs deeper
			this._insert(item, curr.children[label] as BTNode<T>);
			//
		} else {
			// base case
			curr.children[label] = new BTNode(item);
		}
		// Recursively Propagate height updates to parent(s)
		this._updateParentHeights(curr);
	}

	/**
	 * Depth first deletion assumes nodes are sorted with values in ascending
	 * order, left to right
	 *
	 * @notes
	 * - case 1 -> no children, so delete node
	 * - case 2 -> one child, so set parent to child of current node
	 * - case 3 -> recurs searching for smallest on large (right) side OR recurs
	 *   searching for largest on small (left) side
	 */
	delete(item: T): boolean {
		return this._delete(item, 'left', this.root);
	}

	private _delete(item: T, label: keyof BTNode<T>['children'], curr?: BTNode<T>): boolean {
		// base case
		if (!curr) {
			return false;
		}

		// recurs to right or left to continue searching for `item`
		if (curr.value !== item) {
			if (curr.value < item) {
				return this._delete(item, 'right', curr.children.right);
			}
			return this._delete(item, 'left', curr.children.left);
		}

		// Early return of `true` when deleting leaves
		if (!curr.children.left && !curr.children.right) {
			// case 1 -> no children, so delete node
			if (curr.parent?.children) {
				curr.parent.children[label] = undefined;
			}

			if (curr === this.root) {
				this.root = undefined;
			}
			curr.height = 0;
			this._updateParentHeights(curr.parent);
			curr.parent = undefined;
			return true;
		}

		if (Boolean(curr.children.left) !== Boolean(curr.children.right)) {
			// case 2 -> one child so replace `curr` with `child`
			let child = curr.children.left as BTNode<T>;
			if (!child) {
				child = curr.children.right as BTNode<T>;
			}

			const child_previous_parent = child.parent;
			(curr.parent as BTNode<T>).children[label] = child;
			child.parent = curr.parent;

			this._updateParentHeights(child_previous_parent);

			if (curr === this.root) {
				this.root = child;
			}

			curr.parent = undefined;

			return true;
		}

		// - case 3 -> recurs searching for smallest on large (right) side OR
		//   recurs searching for largest on small (left) side
		let child: BTNode<T>;
		let child_label: keyof BTNode<T>['children'] = 'left';
		if ((curr.children.left as BTNode<T>).height > (curr.children.right as BTNode<T>).height) {
			child = this._findLastNode(child_label, curr.children.right as BTNode<T>);
		} else {
			child_label = 'right';
			child = this._findLastNode(child_label, curr.children.left as BTNode<T>);
		}

		const child_previous_parent = child.parent;
		child.children = curr.children;
		child.parent = curr.parent;

		Object.values(curr.children).forEach((node) => {
			node.parent = child;
		});

		if (curr === this.root) {
			this.root = child;
		}

		curr.parent = undefined;
		this._updateParentHeights(child_previous_parent);
		if (child_previous_parent?.children) {
			child_previous_parent.children[child_label] = undefined;
		}

		return true;
	}

	/**
	 * Assumes `curr` has at least one child
	 */
	private _updateParentHeights(curr: BTNode<T> | undefined): void {
		// base case one, out of bounds
		if (!curr) {
			return;
		}

		const height = Math.max(curr.children.left?.height || 0, curr.children.right?.height || 0) + 1;

		// base case two, no update needed
		if (height === curr.height) {
			return;
		}

		curr.height = height;

		// recurs
		return this._updateParentHeights(curr.parent);
	}

	private _findLastNode(label: keyof BTNode<T>['children'], curr: BTNode<T>): BTNode<T> {
		if (!curr.children[label]) {
			return curr;
		}
		return this._findLastNode(label, curr.children[label] as BTNode<T>);
	}
}
