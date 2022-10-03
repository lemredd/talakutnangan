import { MINUTE_SCHEDULE_INTERVAL } from "$/constants/numerical"

import convertTimeToMinutes from "$/time/convert_time_to_minutes"

type Limitations = { "start": number, "end": number }

export default function(limitations: Limitations = {
	"end": convertTimeToMinutes("23:45"),
	"start": convertTimeToMinutes("00:00")
}) {
	const times = []

	for (let i = limitations.start; i <= limitations.end; i += MINUTE_SCHEDULE_INTERVAL) {
		times.push(i)
	}

	return times
}
