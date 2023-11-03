package doubly_linked_list

import (
	"testing"
)

func Test_Prepend(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	i := len(items) - 1
	for j, _ := range items {
		value := j + 10
		items[i] = value
		list.Prepend(value)
		i--
	}

	done := make(chan struct{})
	defer close(done)
	for iv := range list.Iter_Entries(done) {
		expected := items[iv.index]
		if iv.value != expected {
			t.Fatalf(`Expected value %v did not match value %v at index %v`, expected, iv.value, iv.index)
		}
	}
}

func Test_InsertAt_errors_as_expected(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	expected := "Index greater than list length"
	var item int
	_, err := list.InsertAt(item, list.Length+1)
	if err.Error() != expected {
		t.Fatalf(`Unexpected error message -> %v`, err)
	}
}

func Test_InsertAt_appends_when_index_equals_list_length(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	for i, _ := range items {
		value := i + 10
		items[i] = value
		list.InsertAt(value, list.Length)
	}

	done := make(chan struct{})
	defer close(done)
	for iv := range list.Iter_Entries(done) {
		expected := items[iv.index]
		if iv.value != expected {
			t.Fatalf(`Expected value %v did not match value %v at index %v`, expected, iv.value, iv.index)
		}
	}
}

func Test_InsertAt_prepends_when_index_equals_zero(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	i := len(items) - 1
	for j, _ := range items {
		value := j + 10
		items[i] = value
		list.InsertAt(value, 0)
		i--
	}

	done := make(chan struct{})
	defer close(done)
	for iv := range list.Iter_Entries(done) {
		expected := items[iv.index]
		if iv.value != expected {
			t.Fatalf(`Expected value %v did not match value %v at index %v`, expected, iv.value, iv.index)
		}
	}
}

func Test_InsertAt_okay_with_inserting_at_middle_of_list(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	for i, _ := range items {
		value := i + 10
		index := list.Length / 2
		items[i] = value
		_, err := list.InsertAt(value, index)
		if err != nil {
			t.Fatalf(`Unexpected error -> %v`, err)
		}
	}

	done := make(chan struct{})
	defer close(done)
	for _, expected := range items {
		value, err := list.Remove(expected)
		if err != nil {
			t.Fatalf(`Unexpected error -> %v`, err)
		}

		if value != expected {
			t.Fatalf(`Expected value %v did not match value %v`, expected, value)
		}
	}

	if list.Length != 0 {
		t.Fatalf(`Expected list length to be zero not -> %v`, list.Length)
	}
}

func Test_Append(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	for i, _ := range items {
		value := i + 10
		items[i] = value
		list.Append(value)
	}

	done := make(chan struct{})
	defer close(done)
	for iv := range list.Iter_Entries(done) {
		expected := items[iv.index]
		if iv.value != expected {
			t.Fatalf(`Expected value %v did not match value %v at index %v`, expected, iv.value, iv.index)
		}
	}
}

func Test_Remove_erros_on_empty_list(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	expected_error := "List is empty"
	var expected_value int

	item := 1337
	value, err := list.Remove(item)
	if err.Error() != expected_error {
		t.Fatalf(`Unexpected error message -> %v`, err)
	}
	if value != expected_value {
		t.Fatalf(`Unexpected value -> %v`, value)
	}
}

func Test_Remove_returns_expected_values(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	for i, _ := range items {
		value := i + 10
		items[i] = value
		list.Append(value)
	}

	for _, expected := range items {
		value, err := list.Remove(expected)
		if err != nil {
			t.Fatalf(`Unexpected error -> %v`, err)
		}

		if value != expected {
			t.Fatalf(`Expected value %v did not match value %v`, expected, value)
		}
	}
}

func Test_Remove_erros_when_item_not_in_list(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	for i, _ := range items {
		value := i + 10
		items[i] = value
		list.Append(value)
	}

	expected := "Value not in list"
	item := 1337
	_, err := list.Remove(item)
	if err.Error() != expected {
		t.Fatalf(`Unexpected error message -> %v`, err)
	}
}

func Test_Get_erros_on_empty_list(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	expected := "List is empty"
	var expected_value int

	index := uint(0)
	value, err := list.Get(index)
	if err.Error() != expected {
		t.Fatalf(`Unexpected error message -> %v`, err)
	}
	if value != expected_value {
		t.Fatalf(`Unexpected value -> %v`, value)
	}
}

func Test_Get_erros_when_index_is_greater_than_list_length(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	for i, _ := range items {
		value := i + 10
		items[i] = value
		list.Append(value)
	}

	expected := "Index greater than list length"
	var expected_value int

	index := uint(1337)
	value, err := list.Get(index)
	if err.Error() != expected {
		t.Fatalf(`Unexpected error message -> %v`, err)
	}
	if value != expected_value {
		t.Fatalf(`Unexpected value -> %v`, value)
	}
}

func Test_Get_returns_expected_values(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	for i, _ := range items {
		value := i + 10
		items[i] = value
		list.Append(value)
	}

	for index, expected := range items {
		value, err := list.Get(uint(index))
		if err != nil {
			t.Fatalf(`Unexpected error -> %v`, err)
		}

		if value != expected {
			t.Fatalf(`Expected value %v did not match value %v`, expected, value)
		}
	}
}

func Test_RemoveAt_errors_on_empty_list(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	expected := "List is empty"
	var expected_value int

	index := uint(0)
	value, err := list.RemoveAt(index)
	if err.Error() != expected {
		t.Fatalf(`Unexpected error message -> %v`, err)
	}
	if value != expected_value {
		t.Fatalf(`Unexpected value -> %v`, value)
	}
}

func Test_RemoveAt_errors_when_index_is_greater_than_list_length(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	for i, _ := range items {
		value := i + 10
		items[i] = value
		list.Append(value)
	}

	expected := "Index greater than list length"
	var expected_value int

	index := uint(1337)
	value, err := list.RemoveAt(index)
	if err.Error() != expected {
		t.Fatalf(`Unexpected error message -> %v`, err)
	}
	if value != expected_value {
		t.Fatalf(`Unexpected value -> %v`, value)
	}
}

func Test_RemoveAt_returns_expected_values_from_tail_of_list(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	for i, _ := range items {
		value := i + 10
		items[i] = value
		list.Append(value)
	}

	for i := list.Length - 1; i <= 0; i-- {
		expected := items[int(i)]

		value, err := list.RemoveAt(i)
		if err != nil {
			t.Fatalf(`Unexpected error -> %v`, err)
		}
		if value != expected {
			t.Fatalf(`Index %v expected value %v did not match value %v`, i, expected, value)
		}
	}
}

func Test_RemoveAt_returns_expected_values_from_head_of_list(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	for i, _ := range items {
		value := i + 10
		items[i] = value
		list.Append(value)
	}

	for index, expected := range items {
		value, err := list.RemoveAt(0)
		if err != nil {
			t.Fatalf(`Unexpected error -> %v`, err)
		}
		if value != expected {
			t.Fatalf(`Index %v expected value %v did not match value %v`, index, expected, value)
		}
	}
}

func Test_Iter_Entries_allows_early_breaking(t *testing.T) {
	list := Doubly_Linked_List[int]{}

	limit := 10
	items := make([]int, limit)
	i := len(items) - 1
	for j, _ := range items {
		value := j + 10
		items[i] = value
		list.Prepend(value)
		i--
	}

	done := make(chan struct{})
	defer close(done)
	for iv := range list.Iter_Entries(done) {
		if iv.index > limit/2 {
			break
		}
	}
}
