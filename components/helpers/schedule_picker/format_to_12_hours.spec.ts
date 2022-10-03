import { NOON } from "$@/constants/time"

import helper from "./format_to_12_hours"

describe("Helper: 12 Hour formatter", () => {
	it("can convert an hour greater than NOON time to 12 hour format", () => {
		const hour = 15
		const expectedValue = hour - NOON

		expect(helper(hour)).toEqual(expectedValue)
	})

	it("should return 12 for the first hour", () => {
		const hour = 0
		const expectedValue = 12

		expect(helper(hour)).toEqual(expectedValue)
	})

	it("should remain the same if hour is less than or equal to NOON", () => {
		const hour = 11

		expect(helper(hour)).toEqual(hour)
		expect(helper(NOON)).toEqual(NOON)
	})
})
