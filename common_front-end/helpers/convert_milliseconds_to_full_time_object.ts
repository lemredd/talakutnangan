import { Duration } from "luxon"
import type { FullTime } from "$@/types/independent"

export default function(milliseconds: number): FullTime {
	const duration = Duration.fromObject({ milliseconds })

	const properDuration = duration.shiftTo("hours", "minutes", "seconds").toObject()

	return {
		"hours": properDuration.hours || 0,
		"minutes": properDuration.minutes || 0,
		"seconds": properDuration.seconds || 0
	}
}
