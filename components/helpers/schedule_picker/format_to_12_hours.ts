import { noon } from "$@/constants/time"

export default function(hour: number) {
	let convertedHour = 0

	if (hour <= noon) convertedHour = hour
	else convertedHour = hour - noon

	return convertedHour
}
