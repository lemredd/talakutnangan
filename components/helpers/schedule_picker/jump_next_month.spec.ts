import helper from "./jump_next_month"

describe("Helper: jump next month", () => {
	it("jump to next month from current date", () => {
		// eslint-disable-next-line no-magic-numbers, id-length
		const d = new Date(2022, 9, 4)
		const expectedValue = new Date(2022, 10, 3)

		expect(helper(d)).toEqual(expectedValue)
	})
})
