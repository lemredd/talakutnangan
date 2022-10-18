import { NOON } from "$@/constants/time"

import twoDigits from "$/time/two_digits"
import formatTo12Hours from "./format_to_12_hours"
import convertMinutesToTimeObject from "%/helpers/convert_minutes_to_time_object"

export default function(timeInMinutes: number, part: "hour" | "minute" | "midday") {
	const timeObject = convertMinutesToTimeObject(timeInMinutes)
	let partToGive = ""

	switch (part) {
		case "hour":
			partToGive = twoDigits(formatTo12Hours(timeObject.hours))
			break
		case "minute":
			partToGive = twoDigits(timeObject.minutes)
			break
		case "midday":
			if (timeObject.hours < NOON) partToGive = "AM"
			else partToGive = "PM"
			break

		default:
			break
	}

	return partToGive
}
