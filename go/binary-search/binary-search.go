package binary_search

import (
	"cmp"
	"errors"
	"math"
)

type OrderedSlice[T cmp.Ordered] []T

/**
 * Returns first index of found needle within order array, or error if needle was not found
 */
func (array OrderedSlice[T]) Binary_Search(needle T) (int, error) {
	lo := 0
	hi := len(array)

	for ok := true; ok; ok = (lo < hi) {
		middle_index := int(math.Floor(float64(lo) + (float64(hi)-float64(lo))/float64(2)))
		middle_value := array[middle_index]

		if middle_value == needle {
			return middle_index, nil
		} else if middle_value > needle {
			hi = middle_index
		} else {
			lo = middle_index + 1
		}
	}

	return int(-1), errors.New("Did not find needle in array")
}
