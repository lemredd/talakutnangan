import { DateTime } from "luxon"

export default function(baseDateTime: Date, minutesAfterMidnight: number): Date {
	const base = DateTime.fromJSDate(baseDateTime)
	const midnight = base.set({
		"hour": 0,
		"millisecond": 0,
		"minute": 0,
		"second": 0
	})
	const targetDatetime = midnight.plus({ "minutes": minutesAfterMidnight })

	return targetDatetime.toJSDate()
}
