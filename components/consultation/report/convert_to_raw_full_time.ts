import type { RawFullTimeString } from "$@/types/component"

import convertMStoTimeObject from "$@/helpers/convert_milliseconds_to_full_time_object"

export default function(timeInMilliseconds: number): RawFullTimeString {
	const {
		hours,
		minutes,
		seconds
	} = convertMStoTimeObject(timeInMilliseconds)

	const hourString = `${Math.abs(Math.round(hours))} hours`
	const minuteString = `${Math.abs(Math.round(minutes))} minutes`
	const secondString = `${Math.abs(Math.round(seconds))} seconds`

	return {
		hourString,
		minuteString,
		secondString
	}
}
