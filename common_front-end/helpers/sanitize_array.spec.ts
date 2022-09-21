import sanitizeArray from "./sanitize_array"

describe("Helper: Sanitize array", () => {
	it("should remove falsy values", () => {
		// eslint-disable-next-line no-undefined
		const unsanitized = [ undefined, 1, null, 2, false, "three" ]
		const sanitized = [ 1, 2, "three" ]

		expect(sanitizeArray(unsanitized)).toEqual(sanitized)
	})
})
