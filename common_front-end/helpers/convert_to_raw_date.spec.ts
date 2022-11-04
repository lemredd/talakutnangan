import helper from "./convert_to_raw_date"

describe("Helper: Convert to raw date", () => {
	it("can convert", () => {
		const date = new Date("2022-10-10T00:00:00")

		const rawDate = helper(date)

		expect(rawDate).toBe("2022-10-10")
	})
})
