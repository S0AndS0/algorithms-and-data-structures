package queue

import (
	"testing"
)

func Test_Enqueue_increments_length(t *testing.T) {
	queue := Queue[uint]{}

	limit := uint(3)

	for i := uint(0); i < limit; i++ {
		queue.Enqueue(i)
	}

	if queue.Length != limit {
		t.Fatalf(`Expected queue.Length of %v but got %v`, limit, queue.Length)
	}
}

func Test_Deque_returns_error_for_empty_queue(t *testing.T) {
	queue := Queue[uint]{}

	value, err := queue.Deque()
	if err == nil {
		t.Fatalf(`Expected error not nil -> %v`, err)
	}

	var expected_value uint
	if value != expected_value {
		t.Fatalf(`Expected value %v did not match returned value %v`, expected_value, value)
	}
}

func Test_Deque_decrements_length_and_returns_values(t *testing.T) {
	queue := Queue[uint]{}

	limit := uint(3)
	expected_values := make([]uint, limit)
	expected_length := limit

	for i := uint(0); i < limit; i++ {
		queue.Enqueue(i)
		expected_values[i] = i
	}

	for i := uint(0); i < limit; i++ {
		value, err := queue.Deque()
		if err != nil {
			t.Fatalf(`Unexpected error %v`, err)
		}

		expected_value := expected_values[i]
		if expected_value != value {
			t.Fatalf(`Expected queue value of %v but got %v`, expected_value, value)
		}

		expected_length--
		if expected_length != queue.Length {
			t.Fatalf(`Expected queue length of %v but got %v`, expected_length, queue.Length)
		}
	}
}

func Test_Peek_returns_expected_value(t *testing.T) {
	queue := Queue[uint]{}

	value := uint(3)

	queue.Enqueue(value)

	peek := queue.Peek()
	if peek != value {
		t.Fatalf(`Expected queue value of %v but got %v`, value, peek)
	}
}
