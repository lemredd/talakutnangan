import { DateTime } from "luxon"

export default function(rawPreviousTime: Date, rawCurrentTime: Date): string {
	const previousTime = DateTime.fromJSDate(rawPreviousTime)
	const currentTime = DateTime.fromJSDate(rawCurrentTime)
	return previousTime.toRelative({
		"base": currentTime
	}) as string
}
