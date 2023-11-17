package binary_tree

import (
	"cmp"
	"encoding/json"
)

type Node_Children[T cmp.Ordered] struct {
	Left  *Node[T] `json:"left"`
	Right *Node[T] `json:"right"`
}

type Node[T cmp.Ordered] struct {
	Value    T                `json:"item"`
	Children Node_Children[T] `json:"children"`
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
	if node.Children.Left != nil {
		target.Children.Left = &Node[T]{}
		clone(node.Children.Left, target.Children.Left)
	}
	if node.Children.Right != nil {
		target.Children.Right = &Node[T]{}
		clone(node.Children.Right, target.Children.Right)
	}
	target.Value = *&node.Value
	return target
}

func (node *Node[T]) To_JSON() (string, error) {
	bytes, err := json.Marshal(node)
	if err != nil {
		return "", err
	}
	return string(bytes), nil
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
	*path = append(*path, curr.Value)

	// recurs
	walkPreOrder(curr.Children.Left, path)
	walkPreOrder(curr.Children.Right, path)

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
	walkInOrder(curr.Children.Left, path)
	*path = append(*path, curr.Value)
	walkInOrder(curr.Children.Right, path)

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
	walkPostOrder(curr.Children.Left, path)
	walkPostOrder(curr.Children.Right, path)

	// post
	*path = append(*path, curr.Value)
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
	} else if curr.Value != other.Value {
		return false
	}

	return compareShapeAndValues(
		curr.Children.Left,
		other.Children.Left,
	) && compareShapeAndValues(
		curr.Children.Right,
		other.Children.Right,
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

	if item == curr.Value {
		return true
	}

	if curr.Value < item {
		return quickFind(item, curr.Children.Right)
	} else {
		return quickFind(item, curr.Children.Left)
	}
}
