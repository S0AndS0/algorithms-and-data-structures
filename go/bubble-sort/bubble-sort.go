package bubble_sort

import "cmp"

func Bubble_Sort[T cmp.Ordered](array []T) {
	length := len(array)
	for i, _ := range array {
		for j := 0; j < length-1-i; j++ {
			next_index := j + 1
			if array[j] > array[next_index] {
				current_value := array[j]

				array[j] = array[next_index]
				array[next_index] = current_value
			}
		}
	}
}
