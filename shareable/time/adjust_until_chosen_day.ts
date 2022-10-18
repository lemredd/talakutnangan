import { DateTime, Duration } from "luxon"

export default function(initialDate: Date, targetDayIndex: number, dayStep: number): Date {
	let adjustedDate = DateTime.fromJSDate(initialDate)

	const TOTAL_NUMBER_OF_DAYS = 7
	do {
		adjustedDate = adjustedDate.plus(Duration.fromObject({ "days": dayStep }))
	} while (adjustedDate.weekday % TOTAL_NUMBER_OF_DAYS !== targetDayIndex)

	return adjustedDate.toJSDate()
}
