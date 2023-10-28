package bubble_sort

import (
	"testing"
)

func Test_Bubble_Sort(t *testing.T) {
	unorderdArray := []int{1, 3, 2, 7, 4}
	expectedArray := []int{1, 2, 3, 4, 7}

	// fmt.Println("unorderdArray", unorderdArray)
	// fmt.Println("expectedArray", expectedArray)
	Bubble_Sort(unorderdArray)
	// fmt.Println("unorderdArray", unorderdArray)

	for i, x := range expectedArray {
		var v = unorderdArray[i]
		if x != v {
			t.Fatalf(`Index %v with value %v did not match expected value %v`, i, v, x)
		}
	}
}
