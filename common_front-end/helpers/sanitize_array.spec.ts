import sanitizeArray from "$@/helpers/sanitize_array"

describe("Helper: Sanitize Array", () => {
	it("Should remove falsy values", () => {
		const unsanitized = [undefined, 1, null, 2, false, "three"]
		const sanitized = [1, 2, "three"]

		expect(sanitizeArray(unsanitized)).toEqual(sanitized)
	})
})
