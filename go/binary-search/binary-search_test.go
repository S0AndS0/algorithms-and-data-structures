package binary_search

import (
	"testing"
)

func Test_Binary_Search_finds_index_of_high_needle(t *testing.T) {
	limit := 10
	haystack := make(OrderedSlice[float32], limit)
	for i := 0; i < limit; i++ {
		haystack[i] = float32(i)
	}

	expected_index := int(haystack[limit-2])
	needle := haystack[expected_index]

	found_index, err := haystack.Binary_Search(needle)
	if err != nil {
		t.Fatalf(`Unexpected error -> %v`, err)
	}

	if found_index != expected_index {
		t.Fatalf(`Found index %v did not match expected index %v`, found_index, expected_index)
	}
}

func Test_Binary_Search_finds_index_of_low_needle(t *testing.T) {
	limit := 10
	haystack := make(OrderedSlice[float32], limit)
	for i := 0; i < limit; i++ {
		haystack[i] = float32(i)
	}

	expected_index := int(haystack[2])
	needle := haystack[expected_index]

	found_index, err := haystack.Binary_Search(needle)
	if err != nil {
		t.Fatalf(`Unexpected error -> %v`, err)
	}

	if found_index != expected_index {
		t.Fatalf(`Found index %v did not match expected index %v`, found_index, expected_index)
	}
}

func Test_Binary_Search_returns_error_when_needle_not_found(t *testing.T) {
	limit := 10
	haystack := make(OrderedSlice[float32], limit)
	for i := 0; i < limit; i++ {
		haystack[i] = float32(i)
	}

	expected_index := -1
	needle := float32(limit + 2)

	found_index, err := haystack.Binary_Search(needle)
	if err == nil {
		t.Fatalf(`Expected error not nil -> %v`, err)
	}

	if found_index != expected_index {
		t.Fatalf(`Found index %v did not match expected index %v`, found_index, expected_index)
	}
}
