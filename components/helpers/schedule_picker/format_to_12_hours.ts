import { NOON } from "$@/constants/time"

export default function(hour: number) {
	let convertedHour = 0

	if (hour === 0) convertedHour = NOON
	else if (hour <= NOON) convertedHour = hour
	else convertedHour = hour - NOON

	return convertedHour
}
