import Validator from "./string_validator"

describe("Validator: String Validator", () => {
	it("can make normal data", async () => {
		const validator = new Validator()

		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", true)
		expect(compiledObject).toHaveProperty("data.type", "string")
		expect(compiledObject).toHaveProperty("meta.transformer")
	})

	it("can run proper caster", async () => {
		const validator = new Validator()
		const compiledObject = validator.compiledObject

		const value = compiledObject.meta.transformer!(1000)

		expect(value).toEqual("1000")
	})

	it("can run custom transformer", async () => {
		const customTranformer = jest.fn().mockReturnValue("75")
		const validator = new Validator().transformBy(customTranformer)
		const compiledObject = validator.compiledObject

		const value = compiledObject.meta.transformer!(true)

		expect(customTranformer).toHaveBeenCalled()
		expect(customTranformer.mock.calls[0]).toEqual([ "true", {} ])
		expect(value).toEqual("75")
	})

	it("can limit the length", async () => {
		const validator = new Validator().inclusiveLength(5, 10)

		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", true)
		expect(compiledObject).toHaveProperty("data.type", "string")
		expect(compiledObject).toHaveProperty("data.min", 5)
		expect(compiledObject).toHaveProperty("data.max", 10)
		expect(compiledObject).toHaveProperty("meta.transformer")
	})
})
