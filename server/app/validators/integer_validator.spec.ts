import Validator from "./integer_validator"

describe("Validator: Integer Validator", () => {
	it("can make normal data", async () => {
		const validator = new Validator()

		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", true)
		expect(compiledObject).toHaveProperty("data.type", "integer")
		expect(compiledObject).toHaveProperty("meta.transformer")
	})

	it("can run proper caster", async () => {
		const validator = new Validator()
		const compiledObject = validator.compiledObject

		const value = compiledObject.meta.transformer!("1")

		expect(value).toEqual(1)
	})

	it("can run custom transformer", async () => {
		const customTranformer = jest.fn().mockReturnValue(2)
		const validator = new Validator().transformBy(customTranformer)
		const compiledObject = validator.compiledObject

		const value = compiledObject.meta.transformer!("3")

		expect(customTranformer).toHaveBeenCalled()
		expect(customTranformer.mock.calls[0]).toEqual([ 3, {} ])
		expect(value).toEqual(2)
	})

	it("can limit the range", async () => {
		const validator = new Validator().inclusiveRange(0, 5)

		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", true)
		expect(compiledObject).toHaveProperty("data.type", "integer")
		expect(compiledObject).toHaveProperty("data.min", 0)
		expect(compiledObject).toHaveProperty("data.max", 5)
		expect(compiledObject).toHaveProperty("meta.transformer")
	})
})
