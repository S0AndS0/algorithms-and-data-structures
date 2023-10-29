package queue

import "errors"

type Node[T any] struct {
	value T
	next  *Node[T]
}

type Queue[T any] struct {
	Length uint
	head   *Node[T]
	tail   *Node[T]
}

/**
 * Appends item to end of queue
 */
func (queue *Queue[T]) Enqueue(item T) {
	node := Node[T]{
		value: item,
	}

	queue.Length++

	if queue.Length == 1 {
		queue.tail = &node
		queue.head = &node
		return
	}

	queue.tail.next = &node
	queue.tail = &node
}

/**
 * Removes and returns first item of queue or an error
 */
func (queue *Queue[T]) Deque() (T, error) {
	if queue.Length == 0 {
		var result T
		return result, errors.New("Queue is empty")
	}

	queue.Length--
	head := queue.head
	queue.head = queue.head.next

	return head.value, nil
}

/**
 * Returns first value of queue without mutation
 */
func (queue *Queue[T]) Peek() T {
	return queue.head.value
}
