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

//
describe('Test binary tree node', () => {
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

	// it('', () => {});
});

//
describe('Test binary tree walking', () => {
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
		const tree = new Binary_Tree(raw_tree_01);
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
		const tree = new Binary_Tree(raw_tree_01);
		const iter = tree.iterPreOrder();
		for (const [index, value] of expected.entries()) {
			expect(iter.next().value).toBe(value);
		}
	});

	it('Binary_Tree.walkInOrder -- returns list with left most child at start, root in middle, and right most child at end', () => {
		const expected = [5, 23, 4, 7, 18, 3, 21];
		const tree = new Binary_Tree(raw_tree_01);
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
		const tree = new Binary_Tree(raw_tree_01);
		const iter = tree.iterInOrder();
		for (const [index, value] of expected.entries()) {
			expect(iter.next().value).toBe(value);
		}
	});

	it('Binary_Tree.walkPostOrder -- returns list with left most child at start, root in middle, and right most child at end', () => {
		const expected = [5, 4, 23, 18, 21, 3, 7];
		const tree = new Binary_Tree(raw_tree_01);
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
		const tree = new Binary_Tree(raw_tree_01);
		const iter = tree.iterPostOrder();
		for (const [index, value] of expected.entries()) {
			expect(iter.next().value).toBe(value);
		}
	});

	it('Binary_Tree.compareShapeAndValues -- returns true for trees of identical shape and values', () => {
		const tree = new Binary_Tree(raw_tree_02);
		expect(tree.compareShapeAndValues({ other: raw_tree_02 })).toBeTruthy();
		expect(tree.compareShapeAndValues({ curr: raw_tree_02, other: raw_tree_02 })).toBeTruthy();
	});

	it('Binary_Tree.compareShapeAndValues -- returns false for trees without identical shape or values', () => {
		const tree = new Binary_Tree(raw_tree_02);
		expect(tree.compareShapeAndValues()).toBeFalsy();
		expect(tree.compareShapeAndValues({ curr: raw_tree_02, other: raw_tree_03 })).toBeFalsy();
		expect(tree.compareShapeAndValues({ other: raw_tree_03 })).toBeFalsy();
		expect(tree.compareShapeAndValues({ curr: raw_tree_02, other: raw_tree_04 })).toBeFalsy();
	});

	// it('', () => {});
});
