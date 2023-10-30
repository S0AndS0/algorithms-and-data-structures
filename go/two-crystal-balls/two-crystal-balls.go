package two_crystal_balls

import (
	"errors"
	"math"
)

func Two_Crystal_Balls[T comparable](breaks []T, target T) (int, error) {
	length := len(breaks)
	jump_ammount := int(math.Floor(math.Sqrt(float64(length))))

	i := jump_ammount
	for ; i < length; i += jump_ammount {
		if breaks[i] == target {
			break
		}
	}

	i -= jump_ammount

	for j := 0; j < jump_ammount && i < length; j++ {
		if breaks[i] == target {
			return i, nil
		}
		i++
	}

	return int(-1), errors.New("Target does not exist in list")
}
