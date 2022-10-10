import isObject from "./is_object"


describe("Helpers: primitive type guards", () => {
	describe("Object assertion", () => {
		it("Should be truthy", () => {
			const value = {}
			const assertion = isObject(value)
			expect(assertion).toBeTruthy()
		})

		it("Should be falsy", () => {
			const value = ""
			const assertion = isObject(value)
			expect(assertion).toBeFalsy()
		})
	})
})
