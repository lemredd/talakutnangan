import helper from "./format_to_friendly_date"

describe("Helper: format to friendly date", () => {
	it("can format times", () => {
		const currentTime = new Date("2022-10-10T17:00:00")

		const string = helper(currentTime)

		expect(string).toBe("October 10, 2022")
	})
})
