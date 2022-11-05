import helper from "./format_to_complete_friendly_time"

describe("Helper: format to friendly past time", () => {
	it("can format times", () => {
		const currentTime = new Date("2022-10-10T17:00:00")

		const string = helper(currentTime)

		expect(string).toBe("Monday, October 10, 2022 at 5:00:00 PM")
	})
})
