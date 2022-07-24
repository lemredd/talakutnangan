import BaseValidator from "./base"

class Validator extends BaseValidator {}

describe("Validator: Base Validator", () => {
	it("can make normal data", async () => {
		const validator = new Validator("typeA")

		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", true)
		expect(compiledObject).toHaveProperty("data.type", "typeA")
		expect(compiledObject).not.toHaveProperty("meta.transformer")
	})

	it("can make optional data", async () => {
		const validator = new Validator("typeB")

		validator.optional()
		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", false)
		expect(compiledObject).toHaveProperty("data.type", "typeB")
		expect(compiledObject).not.toHaveProperty("meta.transformer")
	})

	it("can set transformer", async () => {
		const validator = new Validator("typeC")
		const transformer = jest.fn()

		validator.transformBy(transformer)
		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", true)
		expect(compiledObject).toHaveProperty("data.type", "typeC")
		expect(compiledObject).toHaveProperty("meta.transformer", transformer)
	})
})
