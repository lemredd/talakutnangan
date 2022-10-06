import { DateTime, Duration } from "luxon"

export default function(date: Date = new Date()) {
	return DateTime.fromJSDate(date).plus(
		Duration.fromObject({ "months": 1 }).shiftTo("milliseconds")
	).toJSDate()
}
