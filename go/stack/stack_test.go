package stack

import (
	"testing"
)

func Test_Push_increments_length(t *testing.T) {
	stack := Stack[uint]{}

	limit := uint(3)

	for i := uint(0); i < limit; i++ {
		stack.Push(i)
	}

	if stack.Length != limit {
		t.Fatalf(`Expected stack.Length of %v but got %v`, limit, stack.Length)
	}
}

func Test_Pop_returns_error_for_empty_stack(t *testing.T) {
	stack := Stack[uint]{}

	value, err := stack.Pop()
	if err == nil {
		t.Fatalf(`Expected error not nil -> %v`, err)
	}

	var expected_value uint
	if value != expected_value {
		t.Fatalf(`Expected value %v did not match returned value %v`, expected_value, value)
	}
}

func Test_Pop_decrements_length_and_returns_values(t *testing.T) {
	stack := Stack[uint]{}

	limit := uint(3)
	expected_values := make([]uint, limit)
	expected_length := limit

	for i, j := uint(0), limit-1; i < limit; i, j = i+1, j-1 {
		stack.Push(i)
		expected_values[j] = i
	}

	for i := uint(0); i < limit; i++ {
		value, err := stack.Pop()
		if err != nil {
			t.Fatalf(`Unexpected error %v`, err)
		}

		expected_value := expected_values[i]
		if expected_value != value {
			t.Fatalf(`Expected stack value of %v but got %v`, expected_value, value)
		}

		expected_length--
		if expected_length != stack.Length {
			t.Fatalf(`Expected stack length of %v but got %v`, expected_length, stack.Length)
		}
	}
}

func Test_Peek_returns_expected_value(t *testing.T) {
	stack := Stack[uint]{}

	value := uint(3)

	stack.Push(value)

	peek, err := stack.Peek()

	if peek != value {
		t.Fatalf(`Expected stack value of %v but got %v`, value, peek)
	}

	if err != nil {
		t.Fatalf(`Unexpected error %v`, err)
	}
}

func Test_Peek_returns_error_for_empty_stack(t *testing.T) {
	stack := Stack[uint]{}

	value, err := stack.Peek()
	if err == nil {
		t.Fatalf(`Expected error not nil -> %v`, err)
	}

	var expected_value uint
	if value != expected_value {
		t.Fatalf(`Expected value %v did not match returned value %v`, expected_value, value)
	}
}
