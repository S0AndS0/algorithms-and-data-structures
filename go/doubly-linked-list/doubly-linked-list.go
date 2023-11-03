package doubly_linked_list

import (
	"errors"
)

// Holds value and pointers to next/previous nodes
type Node[T comparable] struct {
	value T
	next  *Node[T]
	prev  *Node[T]
}

// Holds index and value data for iterators to pass via channels
type Index_Value[T comparable] struct {
	index int
	value T
}

// Holds length and pointers to head/tail nodes
type Doubly_Linked_List[T comparable] struct {
	Length uint
	head   *Node[T]
	tail   *Node[T]
}

// Insert item at head of list
func (list *Doubly_Linked_List[T]) Prepend(item T) {
	node := Node[T]{
		value: item,
	}

	list.Length++
	if list.Length == 1 {
		list.head = &node
		list.tail = &node
		return
	}

	// Attach node to list
	node.next = list.head

	// Attach list to node
	list.head.prev = &node
	list.head = &node
}

func (list *Doubly_Linked_List[T]) InsertAt(item T, index uint) (any, error) {
	if index > list.Length {
		return nil, errors.New("Index greater than list length")
	} else if index == list.Length {
		list.Append(item)
		return nil, nil
	} else if index == 0 {
		list.Prepend(item)
		return nil, nil
	}

	curr, _ := list.getAt(index)

	list.Length++

	// Create and attach new node to list
	node := Node[T]{
		value: item,
		next:  curr,
		prev:  curr.prev,
	}

	// Attach list to node
	curr.prev = &node
	if node.prev != nil {
		node.prev.next = &node
	}

	return nil, nil
}

// Insert item at head of list
func (list *Doubly_Linked_List[T]) Append(item T) {
	node := Node[T]{
		value: item,
	}

	list.Length++
	if list.tail == nil {
		list.head = &node
		list.tail = &node
		return
	}

	// Attach node to list
	node.prev = list.tail

	// Attach list to node
	list.tail.next = &node
	list.tail = &node
}

// Traverse list, from head to tail, and remove first node with matching value
func (list *Doubly_Linked_List[T]) Remove(item T) (T, error) {
	if list.Length == 0 {
		var result T
		return result, errors.New("List is empty")
	}

	node := list.head
	for i := uint(0); i < list.Length; i++ {
		if node != nil {
			if item == node.value {
				return list.removeNode(node), nil
			}
			node = node.next
		}
	}

	var result T
	return result, errors.New("Value not in list")
}

// Traverse list and attempt to retrieve value at given index
func (list *Doubly_Linked_List[T]) Get(index uint) (T, error) {
	node, err := list.getAt(index)
	if err != nil {
		var result T
		return result, err
	}
	return node.value, nil
}

// Traverse list and attempt to remove node at given index
func (list *Doubly_Linked_List[T]) RemoveAt(index uint) (T, error) {
	node, err := list.getAt(index)
	if err != nil {
		var result T
		return result, err
	}

	return list.removeNode(node), nil
}

// Iterate from head, to tail, and communicate index/value pares over channel
//
// ## Example
//
//	done := make(chan struct{})
//	defer close(done)
//	for iv := range list.Iter_Entries(done) {
//		fmt.Println("iv.index ->", iv.index, "iv.value ->", iv.value)
//	}
func (list *Doubly_Linked_List[T]) Iter_Entries(done <-chan struct{}) <-chan Index_Value[T] {
	channel := make(chan Index_Value[T])

	go func() {
		defer close(channel)
		index := 0
		node := list.head
		for node != nil {
			select {
			case channel <- Index_Value[T]{
				index: index,
				value: node.value,
			}:
			case <-done:
				return
			}
			node = node.next
			index++
		}
	}()

	return channel
}

// Return value of node after updating connections and list pointers
// @note - Callers must preform bounds checks or return value checks
func (list *Doubly_Linked_List[T]) removeNode(node *Node[T]) T {
	list.Length--
	if list.Length == 0 {
		list.head = nil
		list.tail = nil
		return node.value
	}

	// Update preexisting connections to _jump_ over node
	if node.prev != nil {
		node.prev.next = node.next
	}
	if node.next != nil {
		node.next.prev = node.prev
	}

	// Update ends of list
	if node == list.head {
		list.head = node.next
	}
	if node == list.tail {
		list.tail = node.prev
	}

	// Free memory
	node.next = nil
	node.prev = nil

	return node.value
}

// Traverse list from end closest to target index
func (list *Doubly_Linked_List[T]) getAt(index uint) (*Node[T], error) {
	if list.Length == 0 {
		return nil, errors.New("List is empty")
	} else if index > list.Length {
		return nil, errors.New("Index greater than list length")
	}

	if index < list.Length/2 {
		node := list.head
		for i := uint(0); i < list.Length; i++ {
			if i == index {
				return node, nil
			}
			node = node.next
		}
	} else {
		node := list.tail
		for i := list.Length - 1; i >= uint(0); i-- {
			if i == index {
				return node, nil
			}
			node = node.prev
		}
	}

	// We should never reach this branch and is only here to satisfy type checker
	return nil, errors.New("Oh no!")
}
