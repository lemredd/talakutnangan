import { DateTime, Duration } from "luxon"

export default function(
	initialDate: Date,
	targetDayIndex: number,
	dayStep: number,
	{
		force = false
	}: Partial<{
		"force": boolean
	}> = {}
): Date {
	let adjustedDate = DateTime.fromJSDate(initialDate)

	if (force) {
		adjustedDate = adjustedDate.plus(Duration.fromObject({ "days": dayStep }))
	}

	const TOTAL_NUMBER_OF_DAYS = 7
	while (adjustedDate.weekday % TOTAL_NUMBER_OF_DAYS !== targetDayIndex) {
		adjustedDate = adjustedDate.plus(Duration.fromObject({ "days": dayStep }))
	}

	return adjustedDate.toJSDate()
}
