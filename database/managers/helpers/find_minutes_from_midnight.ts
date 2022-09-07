import { DateTime } from "luxon"

export default function(datetime: Date): number {
	const subtrahend = DateTime.fromJSDate(datetime)
	const midnight = subtrahend.set({
		"hour": 0,
		"millisecond": 0,
		"minute": 0,
		"second": 0
	})

	const difference = subtrahend.diff(midnight)

	return Math.floor(difference.as("minutes"))
}
