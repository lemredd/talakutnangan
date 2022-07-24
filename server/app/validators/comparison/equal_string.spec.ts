import Validator from "./equal_string"

describe("Validator: Equal String Validator", () => {
	it("can make normal data", async () => {
		const validator = new Validator("hello")

		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", true)
		expect(compiledObject).toHaveProperty("data.type", "string")
		expect(compiledObject).toHaveProperty("data.asyncValidator")
		expect(compiledObject).toHaveProperty("meta.transformer")
	})

	it("can accept valid value", async () => {
		const validator = new Validator("42")
		const compiledObject = validator.compiledObject
		const callback = jest.fn()

		await compiledObject.data.asyncValidator!(null, "42", callback)

		expect(callback).toHaveBeenCalled()
		expect(callback.mock.calls[0]).toEqual([])
	})

	it("cannot accept invalid value", async () => {
		const validator = new Validator("42")
		const compiledObject = validator.compiledObject
		const callback = jest.fn()

		await compiledObject.data.asyncValidator!({ field: "data.hello" }, "43", callback)

		expect(callback).toHaveBeenCalled()
		expect(callback.mock.calls[0]).not.toEqual([])
	})
})
