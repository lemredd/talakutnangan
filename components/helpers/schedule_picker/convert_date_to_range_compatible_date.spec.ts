import helper from "./convert_date_to_range_compatible_date"

describe("Helper: convert date to range compatible date", () => {
	it("convert date to range compatible date", () => {
		// eslint-disable-next-line no-magic-numbers
		const d = new Date(2022, 9, 4)
		const expectedValue = "2022-10-04"

		expect(helper(d)).toEqual(expectedValue)
	})
})
