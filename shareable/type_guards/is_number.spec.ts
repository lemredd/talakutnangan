import isNumber from "./is_number"

describe("Type guard: Number", () => {
	describe("Number assertion", () => {
		it("Should be truthy", () => {
			const value = 5
			const assertion = isNumber(value)
			expect(assertion).toBeTruthy()
		})

		it("Should be falsy", () => {
			const value = ""
			const assertion = isNumber(value)
			expect(assertion).toBeFalsy()
		})
	})
})
