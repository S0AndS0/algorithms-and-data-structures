// vim: noexpandtab

import { BTNode, Binary_Tree } from '../binary-tree/binary-tree.js';

/**
 * @example Binary tree as graph
 *
 * ```
 *                      +---+
 *                      | 7 |
 *                      +---+
 *                     _|   |_
 *                   _/       \_
 *                 _/           \_
 *               _/               \_
 *          +----+                  +---+
 *          | 23 |                  | 3 |
 *          +----+                  +---+
 *         _|    |_                _|   |_
 *       _/        \_            _/       \_
 *   +---+          +---+    +----+        +----+
 *   | 5 |          | 4 |    | 18 |        | 21 |
 *   +---+          +---+    +----+        +----+
 * ```
 */
const raw_tree_01 = BTNode.fromObject({
	item: 7,
	children: {
		left: {
			item: 23,
			children: {
				left: { item: 5 },
				right: { item: 4 },
			},
		},
		right: {
			item: 3,
			children: {
				left: { item: 18 },
				right: { item: 21 },
			},
		},
	},
});

/**
 * @example Binary tree as graph
 *
 * ```
 *                      +---+
 *                      | 5 |
 *                      +---+
 *                     _|   |_
 *                   _/       \_
 *                 _/           \_
 *               _/               \_
 *           +---+                  +------+
 *           | 3 |                  | 0x45 |
 *           +---+                  +------+
 * ```
 */
const raw_tree_02 = BTNode.fromObject({
	item: 5,
	children: {
		left: { item: 3 },
		right: { item: 0x45 },
	},
});

/**
 * @example Binary tree as graph
 *
 * ```
 *                         +---+
 *                         | 5 |
 *                         +---+
 *                        _|
 *                      _/
 *                    _/
 *                  _/
 *              +---+
 *              | 3 |
 *              +---+
 *            _|
 *          _/
 *   +------+
 *   | 0x45 |
 *   +------+
 * ```
 */
const raw_tree_03 = BTNode.fromObject({
	item: 5,
	children: {
		left: {
			item: 3,
			children: {
				left: { item: 0x45 },
			},
		},
	},
});

/**
 * @example Binary tree as graph
 *
 * ```
 *                      +---+
 *                      | 5 |
 *                      +---+
 *                     _|   |_
 *                   _/       \_
 *                 _/           \_
 *               _/               \_
 *           +---+                  +-----+
 *           | 3 |                  | 420 |
 *           +---+                  +-----+
 * ```
 */
const raw_tree_04 = BTNode.fromObject({
	item: 5,
	children: {
		left: { item: 3 },
		right: { item: 420 },
	},
});

/**
 * @example Sorted binary tree as graph
 *
 * ```
 *                      +----+
 *                      | 42 |
 *                      +----+
 *                     _|    |_
 *                   _/        \_
 *                 _/            \_
 *               _/                \_
 *          +---+                    +------+
 *          | 9 |                    | 0x45 |
 *          +---+                    +------+
 *         _|    |_                 _|      |_
 *       _/        \_             _/          \_
 *   +---+          +----+    +----+           +-----+
 *   | 5 |          | 18 |    | 52 |           | 420 |
 *   +---+          +----+    +----+           +-----+
 * ```
 */
const raw_tree_05 = BTNode.fromObject({
	item: 42,
	children: {
		left: {
			item: 9,
			children: {
				left: { item: 5 },
				right: { item: 18 },
			},
		},
		right: {
			item: 0x45,
			children: {
				left: { item: 52 },
				right: { item: 420 },
			},
		},
	},
});

//
describe('BTNode', () => {
	it('BTNode.toJSON -- serializes node data and preserves shape when called by `JSON.stringify`', () => {
		const result = JSON.stringify(raw_tree_02);
		const expected = '{"item":5,"children":{"left":{"item":3},"right":{"item":69}}}';
		expect(result).toBe(expected);
	});

	it('BTNode.toJSON -- serializes node data and preserves shape when called by directly', () => {
		const result = raw_tree_02.toJSON();
		const expected = '{"item":5,"children":{"left":{"item":3},"right":{"item":69}}}';
		expect(result).toBe(expected);
	});

	it('BTNode.toObject -- converts node(s) into structured Object(s)', () => {
		const result = raw_tree_02.toObject();
		const expected = JSON.parse('{"item":5,"children":{"left":{"item":3},"right":{"item":69}}}');
		expect(result).toStrictEqual(expected);
	});

	it('BTNode.fromObject -- Resurrects pickled data of complete tree', () => {
		const object = { item: 5, children: { left: { item: 3 }, right: { item: 69 } } };
		const nodes = BTNode.fromObject(object);
		expect(nodes.toObject()).toStrictEqual(object);
	});

	it('BTNode.fromObject -- Resurrects pickled data of incomplete tree', () => {
		const object = { item: 5, children: { left: { item: 3 }, right: {} } };
		const nodes = BTNode.fromObject(object);
		/* @ts-ignore next */
		delete object.children.right;
		expect(nodes.toObject()).toStrictEqual(object);
	});

	it('BTNode.clone -- Creates deep clone of nodes', () => {
		const root_01 = raw_tree_01.clone();
		expect(root_01.toObject()).toStrictEqual(raw_tree_01.toObject());

		root_01.value = 1337;
		expect(root_01.toObject()).not.toStrictEqual(raw_tree_01.toObject());
	});

	// it('', () => {});
});

//
describe('Binary_Tree', () => {
	it('Binary_Tree.constructor -- wraps non BTNode root as instance of BTNode', () => {
		const root = 42;
		expect(new Binary_Tree(root)).toBeInstanceOf(Binary_Tree);
	});

	it('Binary_Tree.constructor -- accepts instance of BTNode as root', () => {
		const root = 42;
		expect(new Binary_Tree(raw_tree_01)).toBeInstanceOf(Binary_Tree);
	});

	it('Binary_Tree.walkPreOrder -- returns list with root at start and right most child at end', () => {
		const expected = [7, 23, 5, 4, 3, 18, 21];
		const root_01 = raw_tree_01.clone();
		const tree = new Binary_Tree(root_01);
		const result = tree.walkPreOrder();
		for (const [index, value] of expected.entries()) {
			expect(result[index]).toBe(value);
		}
	});

	it('Binary_Tree.iterPreOrder -- throws error when node is not instance of BTNode', () => {
		expect(() => {
			/* @ts-ignore-next */
			[...new Binary_Tree().iterPreOrder('nope')];
		}).toThrow('Node not an instance of BTNode');
	});

	it('Binary_Tree.iterPreOrder -- yields values in expected order', () => {
		const expected = [7, 23, 5, 4, 3, 18, 21];
		const root_01 = raw_tree_01.clone();
		const tree = new Binary_Tree(root_01);
		const iter = tree.iterPreOrder();
		for (const [index, value] of expected.entries()) {
			expect(iter.next().value).toBe(value);
		}
	});

	it('Binary_Tree.walkInOrder -- returns list with left most child at start, root in middle, and right most child at end', () => {
		const expected = [5, 23, 4, 7, 18, 3, 21];
		const root_01 = raw_tree_01.clone();
		const tree = new Binary_Tree(root_01);
		const result = tree.walkInOrder();
		for (const [index, value] of expected.entries()) {
			expect(result[index]).toBe(value);
		}
	});

	it('Binary_Tree.iterInOrder -- throws error when node is not instance of BTNode', () => {
		expect(() => {
			/* @ts-ignore-next */
			[...new Binary_Tree().iterInOrder('nope')];
		}).toThrow('Node not an instance of BTNode');
	});

	it('Binary_Tree.iterInOrder -- yields values in expected order', () => {
		const expected = [5, 23, 4, 7, 18, 3, 21];
		const root_01 = raw_tree_01.clone();
		const tree = new Binary_Tree(root_01);
		const iter = tree.iterInOrder();
		for (const [index, value] of expected.entries()) {
			expect(iter.next().value).toBe(value);
		}
	});

	it('Binary_Tree.walkPostOrder -- returns list with left most child at start, root in middle, and right most child at end', () => {
		const expected = [5, 4, 23, 18, 21, 3, 7];
		const root_01 = raw_tree_01.clone();
		const tree = new Binary_Tree(root_01);
		const result = tree.walkPostOrder();
		for (const [index, value] of expected.entries()) {
			expect(result[index]).toBe(value);
		}
	});

	it('Binary_Tree.iterPostOrder -- throws error when node is not instance of BTNode', () => {
		expect(() => {
			/* @ts-ignore-next */
			[...new Binary_Tree().iterPostOrder('nope')];
		}).toThrow('Node not an instance of BTNode');
	});

	it('Binary_Tree.iterPostOrder -- yields values in expected order', () => {
		const expected = [5, 4, 23, 18, 21, 3, 7];
		const root_01 = raw_tree_01.clone();
		const tree = new Binary_Tree(root_01);
		const iter = tree.iterPostOrder();
		for (const [index, value] of expected.entries()) {
			expect(iter.next().value).toBe(value);
		}
	});

	it('Binary_Tree.compareShapeAndValues -- returns true for trees of identical shape and values', () => {
		const root_02 = raw_tree_02.clone();
		const tree = new Binary_Tree(root_02);
		expect(tree.compareShapeAndValues({ other: root_02 })).toBeTruthy();
		expect(tree.compareShapeAndValues({ curr: root_02, other: root_02 })).toBeTruthy();
	});

	it('Binary_Tree.compareShapeAndValues -- returns false for trees without identical shape or values', () => {
		const root_02 = raw_tree_02.clone();
		const root_03 = raw_tree_03.clone();
		const root_04 = raw_tree_04.clone();
		const tree = new Binary_Tree(root_02);
		expect(tree.compareShapeAndValues()).toBeFalsy();
		expect(tree.compareShapeAndValues({ curr: root_02, other: root_03 })).toBeFalsy();
		expect(tree.compareShapeAndValues({ other: root_03 })).toBeFalsy();
		expect(tree.compareShapeAndValues({ curr: root_02, other: root_04 })).toBeFalsy();
	});

	it('Binary_Tree.quickFind -- returns false when item does not exist in tree', () => {
		const root_05 = raw_tree_05.clone();
		const tree = new Binary_Tree(root_05);
		const item = 1337;
		expect(tree.quickFind(item)).toBeFalsy();
	});

	it('Binary_Tree.quickFind -- returns true when item does exist in tree right branch', () => {
		const root_05 = raw_tree_05.clone();
		const tree = new Binary_Tree(root_05);
		const item = 0x45;
		expect(tree.quickFind(item)).toBeTruthy();
	});

	it('Binary_Tree.quickFind -- returns true when item does exist in tree left branch', () => {
		const root_05 = raw_tree_05.clone();
		const tree = new Binary_Tree(root_05);
		const item = 18;
		expect(tree.quickFind(item)).toBeTruthy();
	});

	it('Binary_Tree.insert -- successfully inserts to the left', () => {
		const root_05 = raw_tree_05.clone();
		const tree = new Binary_Tree(root_05);
		const item = 1;

		/* @ts-ignore next */
		const height_start = tree.root.height;

		const expected_object = root_05.toObject();
		/* @ts-ignore next */
		expected_object.children.left.children.left.children = { left: { item } };

		tree.insert(item);
		/* @ts-ignore next */
		expect(tree.root.toObject()).toStrictEqual(expected_object);

		/* @ts-ignore next */
		const height_end = tree.root.height;
		expect(height_end).toBeGreaterThan(height_start);
	});

	it('Binary_Tree.insert -- successfully inserts to the right', () => {
		const root_05 = raw_tree_05.clone();
		const tree = new Binary_Tree(root_05);
		const item = 512;

		const height_start = root_05.height;

		const expected_object = root_05.toObject();
		/* @ts-ignore next */
		expected_object.children.right.children.right.children = { right: { item } };

		tree.insert(item);
		expect(root_05.toObject()).toStrictEqual(expected_object);

		const height_end = root_05.height;
		expect(height_end).toBeGreaterThan(height_start);
	});

	it('Binary_Tree.delete -- does not modify tree if value does not exist on left branches', () => {
		const root_05 = raw_tree_05.clone();
		const tree = new Binary_Tree(root_05);
		const item = 1;
		const expected_object = raw_tree_05.clone().toObject();

		tree.delete(item);
		expect(root_05.toObject()).toStrictEqual(expected_object);
	});

	it('Binary_Tree.delete -- does not modify tree if value does not exist on right branches', () => {
		const root_05 = raw_tree_05.clone();
		const tree = new Binary_Tree(root_05);
		const item = 1337;
		const expected_object = raw_tree_05.clone().toObject();

		tree.delete(item);
		expect(root_05.toObject()).toStrictEqual(expected_object);
	});

	it('Binary_Tree.delete -- removes leaves from left branches', () => {
		const root_05 = raw_tree_05.clone();
		const tree = new Binary_Tree(root_05);
		const expected_object = raw_tree_05.clone().toObject();

		const leaf_left = 5;
		tree.delete(leaf_left);

		/* @ts-ignore next */
		delete expected_object.children.left.children.left;
		expect(root_05.toObject()).toStrictEqual(expected_object);

		const leaf_right = 18;
		tree.delete(leaf_right);

		/* @ts-ignore next */
		delete expected_object.children.left.children;
		expect(root_05.toObject()).toStrictEqual(expected_object);
	});

	it('Binary_Tree.delete -- removes leaves from right branches', () => {
		const root_05 = raw_tree_05.clone();
		const tree = new Binary_Tree(root_05);
		const expected_object = raw_tree_05.clone().toObject();

		const leaf_left = 52;
		tree.delete(leaf_left);

		/* @ts-ignore next */
		delete expected_object.children.right.children.left;
		expect(root_05.toObject()).toStrictEqual(expected_object);

		const leaf_right = 420;
		tree.delete(leaf_right);

		/* @ts-ignore next */
		delete expected_object.children.right.children;
		expect(root_05.toObject()).toStrictEqual(expected_object);
	});

	it('Binary_Tree.delete -- removes root when deleting last leaf', () => {
		const root = 42;
		const tree = new Binary_Tree(root);
		tree.delete(root);
		/* @ts-ignore next */
		expect(tree.root).toBeUndefined();
	});

	it('Binary_Tree.delete -- replaces node with when only left child exists', () => {
		const root_05 = raw_tree_05.clone();
		const root_object = root_05.toObject();
		/* @ts-ignore next */
		delete root_object.children.left.children.right; //> 18
		/* @ts-ignore next */
		const item = root_object.children.left.item; //> 9

		const root = BTNode.fromObject(root_object);
		const tree = new Binary_Tree(root);

		tree.delete(item as number);

		const expected = structuredClone(root_object);
		/* @ts-ignore next */
		expected.children.left = expected.children.left.children.left;

		/* @ts-ignore next */
		expect(tree.root.toObject()).toEqual(expected);
	});

	it('Binary_Tree.delete -- replaces node with when only right child exists', () => {
		const root_05 = raw_tree_05.clone();
		const root_object = root_05.toObject();
		/* @ts-ignore next */
		delete root_object.children.left.children.left; //> 5
		/* @ts-ignore next */
		const item = root_object.children.left.item; //> 9

		const root = BTNode.fromObject(root_object);
		const tree = new Binary_Tree(root);

		tree.delete(item as number);

		const expected = structuredClone(root_object);
		/* @ts-ignore next */
		expected.children.left = expected.children.left.children.right;

		/* @ts-ignore next */
		expect(tree.root.toObject()).toEqual(expected);
	});

	it('Binary_Tree.delete -- re-parents using the largest from left', () => {
		const root = raw_tree_05.clone();
		const root_object = root.toObject();
		const tree = new Binary_Tree(root);
		const item = root_object.item; //> 42

		tree.delete(item as number);

		/* @ts-ignore next */
		root_object.item = root_object.children.left.children.right.item; //> 18
		/* @ts-ignore next */
		delete root_object.children.left.children.right;

		/* @ts-ignore next */
		expect(tree.root.toObject()).toEqual(root_object);
	});

	// it('', () => {});
});
