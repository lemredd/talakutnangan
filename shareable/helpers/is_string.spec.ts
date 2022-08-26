import isString from "./is_string"

describe("Helper: Is string", () => {
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
