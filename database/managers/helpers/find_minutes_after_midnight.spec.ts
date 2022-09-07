/* eslint-disable no-magic-numbers */
import findMinutesAfterMidnight from "./find_minutes_after_midnight"

describe("Database: Find minutes from midnight", () => {
	it("can calculate minutes", () => {
		const date = new Date(2000, 1, 1, 1, 30, 30)

		const minutes = findMinutesAfterMidnight(date)

		expect(minutes).toEqual(90)
	})
})
