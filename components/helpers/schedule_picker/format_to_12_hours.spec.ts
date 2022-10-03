import { noon } from "$@/constants/time"

import helper from "./format_to_12_hours"

describe("Helper: 12 Hour formatter", () => {
	it("can convert an hour greater than noon time to 12 hour format", () => {
		const hour = 15
		const expectedValue = hour - noon

		expect(helper(hour)).toEqual(expectedValue)
	})
	it("should remain the same if hour is less than or equal to noon", () => {
		const hour = 11

		expect(helper(hour)).toEqual(hour)
		expect(helper(noon)).toEqual(noon)
	})
})
