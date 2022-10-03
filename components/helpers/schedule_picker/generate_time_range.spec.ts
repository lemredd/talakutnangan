import convertTimeToMinutes from "$/time/convert_time_to_minutes"

import helper from "./generate_time_range"

describe("Helper: Time range generator", () => {
	it("can generate time range without limits", () => {
		const generatedTimes = helper()
		const expectedStartValue = convertTimeToMinutes("00:00")
		const expectedEndValue = convertTimeToMinutes("23:45")

		expect(generatedTimes[0]).toEqual(expectedStartValue)
		expect(generatedTimes[generatedTimes.length - 1]).toEqual(expectedEndValue)
	})

	it("can generate time range with given limits", () => {
		const limitations = {
			"end": 780,
			"start": 0
		}
		const generatedTimes = helper(limitations)
		const expectedStartValue = convertTimeToMinutes("00:00")
		const expectedEndValue = convertTimeToMinutes("13:00")

		expect(generatedTimes[0]).toEqual(expectedStartValue)
		expect(generatedTimes[generatedTimes.length - 1]).toEqual(expectedEndValue)
	})
})
