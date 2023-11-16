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

var raw_tree_04 = Node[int]{
	value: 5,
	children: Node_Children[int]{
		left: &Node[int]{
			value: 3,
		},
		right: &Node[int]{
			value: 420,
		},
	},
}

// Sorted binary tree
var raw_tree_05 = Node[int]{
	value: 42,
	children: Node_Children[int]{
		left: &Node[int]{
			value: 9,
			children: Node_Children[int]{
				left: &Node[int]{
					value: 5,
				},
				right: &Node[int]{
					value: 18,
				},
			},
		},
		right: &Node[int]{
			value: 0x45,
			children: Node_Children[int]{
				left: &Node[int]{
					value: 52,
				},
				right: &Node[int]{
					value: 420,
				},
			},
		},
	},
}

func Test_Node_Clone_creates_deep_clone_of_nodes(t *testing.T) {
	root_01 := raw_tree_01.Clone()
	root_01.value = 1337
	if root_01.value == raw_tree_01.value {
		t.Fatalf(`Unexpected mutation`)
	}
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

func Test_Tree_Quick_Find_returns_false_when_item_does_not_exist_in_tree(t *testing.T) {
	tree_05 := Binary_Tree[int]{root: &raw_tree_05}

	item := 1337

	result := tree_05.Quick_Find(item)
	if result != false {
		t.Fatalf(`Expected false from searching for non-existent item`)
	}
}

func Test_Tree_Quick_Find_returns_true_when_item_does_exist_in_tree_right_branch(t *testing.T) {
	tree_05 := Binary_Tree[int]{root: &raw_tree_05}

	item := 0x45

	result := tree_05.Quick_Find(item)
	if result != true {
		t.Fatalf(`Expected tree from searching for existent item`)
	}
}

func Test_Tree_Quick_Find_returns_true_when_item_does_exist_in_tree_left_branch(t *testing.T) {
	tree_05 := Binary_Tree[int]{root: &raw_tree_05}

	item := 18

	result := tree_05.Quick_Find(item)
	if result != true {
		t.Fatalf(`Expected tree from searching for existent item`)
	}
}
