import string from "./string"

describe("Validator pipe: string", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve("world")
		const constraints = { request: null, field: "hello" }

		const sanitizeValue = await string(value, constraints)

		expect(sanitizeValue).toEqual("world")
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(2)
		const constraints = { request: null, field: "hello" }

		const error = string(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
