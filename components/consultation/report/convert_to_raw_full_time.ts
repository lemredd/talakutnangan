import type { RawFullTimeString } from "$@/types/component"

import pluralize from "$/string/pluralize"
import convertMStoTimeObject from "$@/helpers/convert_milliseconds_to_full_time_object"

export default function(timeInMilliseconds: number): RawFullTimeString {
	const {
		hours,
		minutes,
		seconds
	} = convertMStoTimeObject(timeInMilliseconds)

	const hourString = pluralize("hour", Math.abs(Math.round(hours)))
	const minuteString = pluralize("minute", Math.abs(Math.round(minutes)))
	const secondString = pluralize("second", Math.abs(Math.round(seconds)))

	return {
		hourString,
		minuteString,
		secondString
	}
}
