import { DateTime } from "luxon"

export default function(rawDate: Date) {
	const date = DateTime.fromJSDate(rawDate)
	return date.toFormat("yyyy-MM-dd")
}
