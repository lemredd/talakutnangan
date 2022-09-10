import convertTimeToMinutes from "./convert_time_to_minutes"

describe("Helpers: Convert hours to minutes", () => {
	it("can convert", () => {
		const time = "23:59"

		const minutes = convertTimeToMinutes(time)

		expect(minutes).toBe(23 * 60 + 59)
	})
})
