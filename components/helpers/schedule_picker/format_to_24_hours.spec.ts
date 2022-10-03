import helper from "./format_to_24_hours"

describe("Helper: 24 Hour formatter", () => {
	it("can convert afternoon hour to 24 hour format", () => {
		const hour = 3
		const midDay = "PM"
		const expectedValue = 15

		expect(helper(hour, midDay)).toEqual(expectedValue)
	})

	it("can convert first hour to 24 hour format", () => {
		const hour = 12
		const midDay = "AM"
		const expectedValue = 0

		expect(helper(hour, midDay)).toEqual(expectedValue)
	})

	it("should remain for morning hours", () => {
		const hour = 11
		const midDay = "AM"
		const expectedValue = hour

		expect(helper(hour, midDay)).toEqual(expectedValue)
	})
})
