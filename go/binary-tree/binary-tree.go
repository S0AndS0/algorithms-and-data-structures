package binary_tree

type Node_Children[T comparable] struct {
	left  *Node[T]
	right *Node[T]
}

type Node[T comparable] struct {
	value    T
	children Node_Children[T]
}

type Binary_Tree[T comparable] struct {
	root *Node[T]
}

// Mutates `path` by pushing values from recursing `tree.root`
func (tree *Binary_Tree[T]) Walk_Pre_Order(path *[]T) *[]T {
	return walkPreOrder(tree.root, path)
}

func walkPreOrder[T comparable](curr *Node[T], path *[]T) *[]T {
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

func walkInOrder[T comparable](curr *Node[T], path *[]T) *[]T {
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

func walkPostOrder[T comparable](curr *Node[T], path *[]T) *[]T {
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

func (tree *Binary_Tree[T]) Compare_Shape_And_Values(other *Binary_Tree[T]) bool {
	return compareShapeAndValues(tree.root, other.root)
}

func compareShapeAndValues[T comparable](curr, other *Node[T]) bool {
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
