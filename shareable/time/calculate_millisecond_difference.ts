import { DateTime } from "luxon"

export default function(rawSubtrahend: Date, rawMinuend: Date): number {
	const subtrahend = DateTime.fromJSDate(rawSubtrahend)
	const minuend = DateTime.fromJSDate(rawMinuend)
	const difference = subtrahend.diff(minuend)
	return difference.milliseconds
}
