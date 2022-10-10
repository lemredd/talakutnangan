import isBoolean from "./is_boolean"


describe("Helpers: primitive type guards", () => {
	describe("Boolean assertion", () => {
		it("Should be truthy", () => {
			const value = true
			const assertion = isBoolean(value)
			expect(assertion).toBeTruthy()
		})

		it("Should be falsy", () => {
			const value = ""
			const assertion = isBoolean(value)
			expect(assertion).toBeFalsy()
		})
	})
})
