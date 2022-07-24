import integer from "./integer"

describe("Validator pipe: integer", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(2)
		const constraints = { request: null, field: "hello" }

		const sanitizeValue = await integer(value, constraints)

		expect(sanitizeValue).toEqual(2)
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve("hello")
		const constraints = { request: null, field: "hello" }

		const error = integer(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})