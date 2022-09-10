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

		it("can check plain object", () => {
			const value = {}

			const assertion = isPlainObject(value)

			expect(assertion).toBeTruthy()
		})

		it("can check null", () => {
			const value = null

			const assertion = isPlainObject(value)

			expect(assertion).toBeFalsy()
		})

		it("can check array", () => {
			const value: any[] = []

			const assertion = isPlainObject(value)

			expect(assertion).toBeFalsy()
		})
	})
})
