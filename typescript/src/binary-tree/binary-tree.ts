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
	children: {
		left?: BTNode<T>;
		right?: BTNode<T>;
	};

	constructor(item: T) {
		this.value = item;
		this.children = {
			left: undefined,
			right: undefined,
		};
	}

	/**
	 * Set child node pointer and value and return pointer to parent
	 *
	 * @template T
	 * @param {Object} o
	 * @param {string} o.label
	 * @param {T|BTNode<T>} o.item
	 * @returns {this}
	 *
	 * @notes
	 *
	 * We could have defined the following types;
	 *
	 * ```typescript
	 * type Children_Pointers<T> = {
	 *   left?: BTNode<T>
	 *   right?: BTNode<T>
	 * }
	 *
	 * type Children_Keys<T> = keyof Children_Pointers<T>
	 * ```
	 *
	 * ... and adjusted the function signature to;
	 *
	 * ```typescript
	 * setChild({ label, item }: { label: Children_Keys<T>; item: T | BTNode<T> }): this
	 * ```
	 *
	 * ... but that makes for less readable error messages.
	 *
	 * @example
	 *
	 * ```javascript
	 * const root = new BTNode(7)
	 *   .setChild({
	 *     label: 'left',
	 *     item: 23,
	 *   })
	 *   .setChild({
	 *     label: 'right',
	 *     item: new BTNode(3)
	 *   })
	 *
	 * console.assert(root.children.left.value === 23);
	 * console.assert(root.children.right.value === 3);
	 * ```
	 */
	setChild({ label, item }: { label: keyof BTNode<T>['children']; item: T | BTNode<T> }): this {
		if (!Object.keys(this.children).includes(label)) {
			throw new Error(`Child label/key does not exist for -> ${label}`);
		}

		if (item instanceof this.constructor) {
			this.children[label] = item as BTNode<T>;
		} else {
			this.children[label] = new (this.constructor as typeof BTNode)(item) as BTNode<T>;
		}
		return this;
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
		return BTNode._fromObject(
			object,
			new (this as typeof BTNode)(undefined) as BTNode<T>
		);
	}

	private static _fromObject<T>(curr: As_Object<T> | undefined, node: BTNode<T>): BTNode<T> {
		if (!curr || curr.item === undefined) {
			return node;
		}

		node.value = curr.item;

		if (curr.children && Object.keys(curr.children).length) {
			node.children = {};
			if (curr.children.left) {
				node.children.left = (this as typeof BTNode).fromObject(curr.children.left);
			}

			if (curr.children.right) {
				node.children.right = (this as typeof BTNode).fromObject(curr.children.right);
			}
		}

		return node;
	}
}

/**
 *
 */
export class Binary_Tree<T> {
	private root: BTNode<T>;

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
	*iterPreOrder(node: BTNode<T> = this.root): Generator<T, void, unknown> {
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
	*iterInOrder(node: BTNode<T> = this.root): Generator<T, void, unknown> {
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
	*iterPostOrder(node: BTNode<T> = this.root): Generator<T, void, unknown> {
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
}
