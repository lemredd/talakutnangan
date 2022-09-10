import isPlainObject from "./is_plain_object"

describe("Type guard: Object", () => {
	describe("Object assertion", () => {
		it("Should be truthy", () => {
			const value = {}
			const assertion = isPlainObject(value)
			expect(assertion).toBeTruthy()
		})

		it("Should be falsy", () => {
			const value = ""
			const assertion = isPlainObject(value)
			expect(assertion).toBeFalsy()
		})
	})
})
