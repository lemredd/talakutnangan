import { Duration } from "luxon"
import type { Time } from "%/types/independent"

export default function(minutes: number): Time {
	const duration = Duration.fromObject({ minutes })

	const properDuration = duration.shiftTo("hours", "minutes").toObject()

	return {
		"hours": properDuration.hours || 0,
		"minutes": properDuration.minutes || 0
	}
}
