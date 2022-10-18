import type { Time } from "%/types/independent"

import twoDigits from "$/time/two_digits"
import formatTo12Hours from "./format_to_12_hours"

export default function(timeObject: Time) {
	return `${twoDigits(formatTo12Hours(timeObject.hours))}:${twoDigits(timeObject.minutes)}`
}
