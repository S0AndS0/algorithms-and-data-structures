package binary_tree

import "cmp"

type Node_Children[T cmp.Ordered] struct {
	left  *Node[T]
	right *Node[T]
}

type Node[T cmp.Ordered] struct {
	value    T
	children Node_Children[T]
	parent   *Node[T]
	height   uint
}

type Binary_Tree[T cmp.Ordered] struct {
	root *Node[T]
}

// Preform depth-first deep clone of node
func (node *Node[T]) Clone() *Node[T] {
	target := &Node[T]{}
	return clone(node, target)
}

func clone[T cmp.Ordered](node, target *Node[T]) *Node[T] {
	if node.children.left != nil {
		target.children.left = &Node[T]{}
		clone(node.children.left, target.children.left)
	}
	if node.children.right != nil {
		target.children.right = &Node[T]{}
		clone(node.children.right, target.children.right)
	}
	target.value = *&node.value
	return target
}

// Mutates `path` by pushing values from recursing `tree.root`
func (tree *Binary_Tree[T]) Walk_Pre_Order(path *[]T) *[]T {
	return walkPreOrder(tree.root, path)
}

func walkPreOrder[T cmp.Ordered](curr *Node[T], path *[]T) *[]T {
	// base case
	if curr == nil {
		return path
	}

	// recurs
	// pre
	*path = append(*path, curr.value)

	// recurs
	walkPreOrder(curr.children.left, path)
	walkPreOrder(curr.children.right, path)

	// post
	return path
}

// Mutates `path` by pushing values from recursing `tree.root`
func (tree *Binary_Tree[T]) Walk_In_Order(path *[]T) *[]T {
	return walkInOrder(tree.root, path)
}

func walkInOrder[T cmp.Ordered](curr *Node[T], path *[]T) *[]T {
	// base case
	if curr == nil {
		return path
	}

	// recurs
	// pre

	// recurs
	walkInOrder(curr.children.left, path)
	*path = append(*path, curr.value)
	walkInOrder(curr.children.right, path)

	// post
	return path
}

// Mutates `path` by pushing values from recursing `tree.root`
func (tree *Binary_Tree[T]) Walk_Post_Order(path *[]T) *[]T {
	return walkPostOrder(tree.root, path)
}

func walkPostOrder[T cmp.Ordered](curr *Node[T], path *[]T) *[]T {
	// base case
	if curr == nil {
		return path
	}

	// recurs
	// pre

	// recurs
	walkPostOrder(curr.children.left, path)
	walkPostOrder(curr.children.right, path)

	// post
	*path = append(*path, curr.value)
	return path
}

// Recursively, depth first search, comparison of two trees and check both
// shape and values are the same
func (tree *Binary_Tree[T]) Compare_Shape_And_Values(other *Binary_Tree[T]) bool {
	return compareShapeAndValues(tree.root, other.root)
}

func compareShapeAndValues[T cmp.Ordered](curr, other *Node[T]) bool {
	if curr == nil && other == nil {
		/* Hit terminus node of both trees */
		return true
	} else if curr == nil || other == nil {
		/* Hit terminus node of only one tree */
		return false
	} else if curr.value != other.value {
		return false
	}

	return compareShapeAndValues(
		curr.children.left,
		other.children.left,
	) && compareShapeAndValues(
		curr.children.right,
		other.children.right,
	)
}

// Breadth first searching assumes nodes are sorted with values in ascending
// order, left to right
//
// @notes
//
// - Running time is measured as a range between `O(log n)` to `O(n)`
// - Running time may be shortened to `O(h)` where `h` is tree height
func (tree *Binary_Tree[T]) Quick_Find(item T) bool {
	return quickFind(item, tree.root)
}

func quickFind[T cmp.Ordered](item T, curr *Node[T]) bool {
	if curr == nil {
		return false
	}

	if item == curr.value {
		return true
	}

	if curr.value < item {
		return quickFind(item, curr.children.right)
	} else {
		return quickFind(item, curr.children.left)
	}
}
