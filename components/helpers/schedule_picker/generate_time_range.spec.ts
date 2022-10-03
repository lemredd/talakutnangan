import helper from "./generate_time_range"

describe("Helper: Time range generator", () => {
	it("can generate time range without limits", () => {
		const generatedTimes = helper()
		const expectedStartValue = "12:00"
		const expectedEndValue = "11:45"

		expect(generatedTimes[0]).toEqual(expectedStartValue)
		expect(generatedTimes[generatedTimes.length - 1]).toEqual(expectedEndValue)
	})

	it("can generate time range with given limits", () => {
		const
	})
})
