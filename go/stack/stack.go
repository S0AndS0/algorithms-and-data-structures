package stack

import "errors"

type Node[T any] struct {
	value T
	prev  *Node[T]
}

type Stack[T any] struct {
	Length uint
	head   *Node[T]
}

/**
 *
 */
func (stack *Stack[T]) Push(item T) {
	node := Node[T]{
		value: item,
	}

	stack.Length++

	if stack.Length == 1 {
		stack.head = &node
		return
	}

	node.prev = stack.head
	stack.head = &node
}

/**
 *
 */
func (stack *Stack[T]) Pop() (T, error) {
	if stack.Length == 0 {
		var result T
		return result, errors.New("Stack is empty")
	}

	stack.Length--
	head := stack.head
	stack.head = head.prev

	return head.value, nil
}

/**
 * Returns first value of stack without mutation
 */
func (stack *Stack[T]) Peek() (T, error) {
	if stack.Length == 0 {
		var result T
		return result, errors.New("Queue is empty")
	}

	return stack.head.value, nil
}
