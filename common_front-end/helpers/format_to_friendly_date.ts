import { DateTime } from "luxon"

export default function(rawCurrentTime: Date): string {
	const currentTime = DateTime.fromJSDate(rawCurrentTime)
	return currentTime.toLocaleString(DateTime.DATE_FULL)
}
