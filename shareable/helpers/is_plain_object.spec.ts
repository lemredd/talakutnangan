import isPlainObject from "./is_plain_object"

describe("Helper: Is plain object", () => {
	it("can check plain object", async () => {
		const value = {}

		const assertion = isPlainObject(value)

		expect(assertion).toBeTruthy()
	})

	it("can check null", async () => {
		const value = null

		const assertion = isPlainObject(value)

		expect(assertion).toBeFalsy()
	})

	it("can check array", async () => {
		const value: any[] = []

		const assertion = isPlainObject(value)

		expect(assertion).toBeFalsy()
	})
})
