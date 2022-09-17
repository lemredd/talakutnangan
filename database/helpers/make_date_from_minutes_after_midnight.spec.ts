/* eslint-disable no-magic-numbers */
import makeDateFromMinutesAfterMidnight from "./make_date_from_minutes_after_midnight"

describe("Database: Make date from minutes after midnight", () => {
	it("can make date from minutes", () => {
		const baseDate = new Date(2000, 0, 0, 2, 30)
		const minutesFromMidnight = 75

		const newDate = makeDateFromMinutesAfterMidnight(baseDate, minutesFromMidnight)

		expect(newDate).toEqual(new Date(2000, 0, 0, 1, 15))
	})
})
