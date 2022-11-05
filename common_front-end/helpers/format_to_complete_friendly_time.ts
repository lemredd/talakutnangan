import { DateTime } from "luxon"

export default function(rawCurrentTime: Date): string {
	const currentTime = DateTime.fromJSDate(rawCurrentTime)
	return `${currentTime.toFormat("DDDD")} at ${currentTime.toFormat("tt")}`
}
