/* eslint-disable no-magic-numbers */
import findMinutesFromMidnight from "./find_minutes_from_midnight"

describe("Database: Find minutes from midnight", () => {
	it("can calculate minutes", () => {
		const date = new Date(2000, 1, 1, 1, 30, 30)

		const minutes = findMinutesFromMidnight(date)

		expect(minutes).toEqual(90)
	})
})
