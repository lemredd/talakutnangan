import helper from "./format_to_friendly_past_time"

describe("Helper: Format to friendly past time", () => {
	it("can format hours", () => {
		const previousTime = new Date("2022-10-10T03:00:00")
		const currentTime = new Date("2022-10-10T05:00:00")

		const string = helper(previousTime, currentTime)

		expect(string).toBe("2 hours ago")
	})

	it("can format days", () => {
		const previousTime = new Date("2022-10-10T03:00:00")
		const currentTime = new Date("2022-10-11T03:00:00")

		const string = helper(previousTime, currentTime)

		expect(string).toBe("1 day ago")
	})
})
