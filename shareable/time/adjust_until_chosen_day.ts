import { DateTime, Duration } from "luxon"

export default function(initialDate: Date, targetDayIndex: number, dayStep: number): Date {
	let adjustedDate = DateTime.fromJSDate(initialDate)

	const TOTAL_NUMBER_OF_DAYS = 7
	while (adjustedDate.weekday % TOTAL_NUMBER_OF_DAYS !== targetDayIndex) {
		adjustedDate = adjustedDate.plus(Duration.fromObject({ "days": dayStep }))
	}

	return adjustedDate.toJSDate()
}
