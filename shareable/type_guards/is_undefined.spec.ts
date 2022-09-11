import isUndefined from "./is_undefined"

describe("Type guard: Undefined", () => {
	it("can check undefined", () => {
		// eslint-disable-next-line no-undefined
		const value = undefined

		const assertion = isUndefined(value)

		expect(assertion).toBeTruthy()
	})

	it("can check defined", () => {
		const value = "hello"

		const assertion = isUndefined(value)

		expect(assertion).toBeFalsy()
	})
})
