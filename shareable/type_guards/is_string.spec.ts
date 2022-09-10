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

		it("can check string", () => {
			const value = "hello"

			const assertion = isString(value)

			expect(assertion).toBeTruthy()
		})

		it("can check null", () => {
			const value = null

			const assertion = isString(value)

			expect(assertion).toBeFalsy()
		})

		it("can check not string", () => {
			const value = 3

			const assertion = isString(value)

			expect(assertion).toBeFalsy()
		})
	})
})
