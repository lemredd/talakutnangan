import { NOON } from "$@/constants/time"

export default function(hour: number, midday: "AM" | "PM") {
	if (midday === "AM") {
		if (hour === NOON) return 0
		return hour
	}

	return hour + NOON
}
