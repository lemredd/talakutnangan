import isString from "./is_string"

describe("Type guard: String", () => {
	describe("String assertion", () => {
		it("Should be truthy", () => {
			const value = ""
			const assertion = isString(value)
			expect(assertion).toBeTruthy()
		})

		it("Should be falsy", () => {
			const value = 1
			const assertion = isString(value)
			expect(assertion).toBeFalsy()
		})
	})
})
