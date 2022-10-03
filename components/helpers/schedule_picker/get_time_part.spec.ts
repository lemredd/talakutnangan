import helper from "./get_time_part"

describe("Helper: Time part extractor", () => {
	it("can return hour", () => {
		const timeInMinutes = 960
		const expectedValue = "04"

		expect(helper(timeInMinutes, "hour")).toEqual(expectedValue)
	})
})
