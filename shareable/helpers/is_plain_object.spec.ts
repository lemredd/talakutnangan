import isPlainObject from "../type_guards/is_object"

describe("Helper: Is plain object", () => {
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
