import twoDigits from "@/helpers/schedule_picker/two_digits"
import getTimePart from "./get_time_part"

type Limitations = { "start": number, "end": number }

export default function(limitations?: Limitations) {
	const time = []

	if (limitations) {
		const defaultStart = 0
		const defaultMinuteEnd = 60
		const defaultHourEnd = 11

		const {
			"start": givenStartLimitation,
			"end": givenEndLimitation
		} = limitations as Limitations
		const hourStart = limitations
			? Number(getTimePart(givenStartLimitation, "hour"))
			: defaultStart
		const hourEnd = limitations
			? Number(getTimePart(givenEndLimitation, "hour"))
			: defaultHourEnd
		const minuteStart = limitations
			? Number(getTimePart(givenStartLimitation, "minute"))
			: defaultStart
		const minuteEnd = limitations
			? Number(getTimePart(givenEndLimitation, "minute"))
			: defaultMinuteEnd

		console.log("hours", hourStart, hourEnd, "\n\n\n\n\n")
		console.log("minutes", minuteStart, minuteEnd, "\n\n\n\n\n")

		for (let i = hourStart; i <= hourEnd; i++) {
			const isOnHourStart = i === hourStart
			const isOnHourEnd = i === hourEnd
			console.log("conditions", isOnHourStart, isOnHourEnd, "\n\n\n")
			for (
				let
					end = isOnHourEnd ? minuteEnd : defaultMinuteEnd,
					interval = 15,
					j = isOnHourStart ? minuteStart : defaultStart;
				j < end;
				j += interval
			) {
				console.log(
					"time to push",
					`${i === 0 ? hourEnd + 1 : twoDigits(i)}:${twoDigits(j)}`,
					"\n\n\n")
				time.push(`${i === 0 ? hourEnd + 1 : twoDigits(i)}:${twoDigits(j)}`)
			}
		}
	} else {
		const hourEnd = 11
		const minuteEnd = 60
		const start = 0

		for (let i = start; i <= hourEnd; i++) {
			for (let interval = 15, j = start; j < minuteEnd; j += interval) {
				time.push(`${i === 0 ? hourEnd + 1 : twoDigits(i)}:${twoDigits(j)}`)
			}
		}
	}

	console.log("time", time, "\n\n\n")
	return time
}
