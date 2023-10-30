package two_crystal_balls

import (
	"math/rand"
	"testing"
	"time"
)

func Test_Two_Crystal_Balls_finds_index_of_target(t *testing.T) {
	limit := 10000
	index := int(rand.New(rand.NewSource(time.Now().UnixNano())).Float64() * float64(limit))
	haystack := make([]bool, limit)

	target := true

	for i := index; i < limit; i++ {
		haystack[i] = target
	}

	found_index, err := Two_Crystal_Balls(haystack, target)
	if err != nil {
		t.Fatalf(`Unexpected error -> %v`, err)
	}

	if found_index != index {
		t.Fatalf(`Found index %v did not match expected index %v`, found_index, index)
	}
}

func Test_Two_Crystal_Balls_returns_error_when_target_not_found(t *testing.T) {
	limit := 10000
	haystack := make([]bool, limit)
	target := true
	expected_index := -1

	found_index, err := Two_Crystal_Balls(haystack, target)
	if err == nil {
		t.Fatalf(`Expected error not nil -> %v`, err)
	}

	if found_index != expected_index {
		t.Fatalf(`Found index %v did not match expected index %v`, found_index, expected_index)
	}
}
