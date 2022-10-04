import { DateTime } from "luxon"

export default function(date: Date): string {
	return DateTime.fromJSDate(date).toFormat("yyyy-MM-dd")
}
