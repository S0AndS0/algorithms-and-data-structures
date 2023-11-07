package binary_tree

import (
	"testing"
)

var raw_tree_01 = Node[int]{
	value: 7,
	children: Node_Children[int]{
		left: &Node[int]{
			value: 23,
			children: Node_Children[int]{
				left: &Node[int]{
					value: 5,
				},
				right: &Node[int]{
					value: 4,
				},
			},
		},
		right: &Node[int]{
			value: 3,
			children: Node_Children[int]{
				left: &Node[int]{
					value: 18,
				},
				right: &Node[int]{
					value: 21,
				},
			},
		},
	},
}

var raw_tree_02 = Node[int]{
	value: 5,
	children: Node_Children[int]{
		left: &Node[int]{
			value: 3,
		},
		right: &Node[int]{
			value: 0x45,
		},
	},
}
var raw_tree_03 = Node[int]{
	value: 5,
	children: Node_Children[int]{
		left: &Node[int]{
			value: 3,
			children: Node_Children[int]{
				left: &Node[int]{
					value: 0x45,
				},
			},
		},
	},
}

func Test_Tree_Walk_Pre_Order(t *testing.T) {
	expected := [7]int{7, 23, 5, 4, 3, 18, 21}

	tree := Binary_Tree[int]{
		root: &raw_tree_01,
	}

	path := make([]int, 0)
	result := tree.Walk_Pre_Order(&path)

	for i, v := range expected {
		r := (*result)[i]
		if v != r {
			t.Fatalf(`Expected value %v did not match result[%v] -> %v`, v, i, r)
		}
	}
}

func Test_Tree_Walk_In_Order(t *testing.T) {
	expected := [7]int{5, 23, 4, 7, 18, 3, 21}

	tree := Binary_Tree[int]{
		root: &raw_tree_01,
	}

	path := make([]int, 0)
	result := tree.Walk_In_Order(&path)

	for i, v := range expected {
		r := (*result)[i]
		if v != r {
			t.Fatalf(`Expected value %v did not match result[%v] -> %v`, v, i, r)
		}
	}
}

func Test_Tree_Walk_Post_Order(t *testing.T) {
	expected := [7]int{5, 4, 23, 18, 21, 3, 7}

	tree := Binary_Tree[int]{
		root: &raw_tree_01,
	}

	path := make([]int, 0)
	result := tree.Walk_Post_Order(&path)

	for i, v := range expected {
		r := (*result)[i]
		if v != r {
			t.Fatalf(`Expected value %v did not match result[%v] -> %v`, v, i, r)
		}
	}
}

func Test_Tree_Compare_Shape_And_Values_returns_true_for_identical_trees(t *testing.T) {
	tree_01 := Binary_Tree[int]{root: &raw_tree_01}
	tree_02 := Binary_Tree[int]{root: &raw_tree_01}

	result := tree_01.Compare_Shape_And_Values(&tree_02)
	if result == false {
		t.Fatalf(`Expected true from comparing identical trees`)
	}
}

func Test_Tree_Compare_Shape_And_Values_returns_false_for_trees_with_different_shape(t *testing.T) {
	tree_02 := Binary_Tree[int]{root: &raw_tree_02}
	tree_03 := Binary_Tree[int]{root: &raw_tree_03}

	result := tree_02.Compare_Shape_And_Values(&tree_03)
	if result == true {
		t.Fatalf(`Expected false from comparing different trees`)
	}
}

func Test_Tree_Compare_Shape_And_Values_returns_false_for_trees_with_different_values(t *testing.T) {
	tree_01 := Binary_Tree[int]{root: &raw_tree_01}
	tree_02 := Binary_Tree[int]{root: &raw_tree_02}

	result := tree_01.Compare_Shape_And_Values(&tree_02)
	if result == true {
		t.Fatalf(`Expected false from comparing different trees`)
	}
}
