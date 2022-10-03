/* eslint-disable no-inline-comments */
/* eslint-disable line-comment-position */
import helper from "./generate_time_range"

describe("Helper: Time range generator", () => {
	it("can generate time range without limits", () => {
		const generatedTimes = helper()
		const expectedStartValue = "12:00" // 00:00 in 24-hour format
		const expectedEndValue = "11:45" // 23:45 in 24-hour format

		expect(generatedTimes[0]).toEqual(expectedStartValue)
		expect(generatedTimes[generatedTimes.length - 1]).toEqual(expectedEndValue)
	})

	it("can generate time range with given limits", () => {
		const limitations = {
			"end": 780,
			"start": 0
		}
		const generatedTimes = helper(limitations)
		const expectedStartValue = "12:00"
		const expectedEndValue = "01:00"

		expect(generatedTimes[0]).toEqual(expectedStartValue)
		expect(generatedTimes[generatedTimes.length - 1]).toEqual(expectedEndValue)
	})
})
