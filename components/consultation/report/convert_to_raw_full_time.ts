import type { RawFullTimeString } from "$@/types/component"

import convertMStoTimeObject from "$@/helpers/convert_milliseconds_to_full_time_object"

export default function(timeInMilliseconds: number): RawFullTimeString {
	const {
		hours,
		minutes,
		seconds
	} = convertMStoTimeObject(timeInMilliseconds)

	const hourString = `${Math.abs(hours)} hours`
	const minuteString = `${Math.abs(minutes)} minutes`
	const secondString = `${Math.abs(seconds)} seconds`

	return {
		hourString,
		minuteString,
		secondString
	}
}
