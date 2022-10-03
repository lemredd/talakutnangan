import helper from "./get_time_part"

describe("Helper: Time part extractor", () => {
	it("can return hour", () => {
		const timeInMinutes = 960
		const expectedValue = "04"

		expect(helper(timeInMinutes, "hour")).toEqual(expectedValue)
	})

	it("can return minutes", () => {
		const timeInMinutes = 990
		const expectedValue = "30"

		expect(helper(timeInMinutes, "minute")).toEqual(expectedValue)
	})

	it("can return midday", () => {
		const timeInMinutes = 960
		const expectedValue = "PM"

		expect(helper(timeInMinutes, "midday")).toEqual(expectedValue)
	})
})
