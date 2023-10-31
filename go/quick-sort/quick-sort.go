package quick_sort

import "cmp"

func qs[T cmp.Ordered](array []T, lo, hi int) {
	if lo >= hi {
		return
	}

	pivot_index := partition(array, lo, hi)
	qs(array, lo, pivot_index-1)
	qs(array, pivot_index+1, hi)
}

func partition[T cmp.Ordered](array []T, lo, hi int) int {
	pivot_value := array[hi]

	pivot_index := lo - 1
	for i := lo; i < hi; i++ {
		if array[i] <= pivot_value {
			pivot_index++
			tmp_value := array[i]
			array[i] = array[pivot_index]
			array[pivot_index] = tmp_value
		}
	}

	pivot_index++
	array[hi] = array[pivot_index]
	array[pivot_index] = pivot_value

	return pivot_index
}

func Quick_Sort[T cmp.Ordered](array []T) {
	qs(array, 0, len(array)-1)
}
