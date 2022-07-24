import BaseValidator from "!/app/validators/base/base"
import ObjectValidator from "!/app/validators/base/object"

import ArrayValidator from "./array"

class Validator extends BaseValidator {}

describe("Validator: Array Validator", () => {
	it("can make normal data", async () => {
		const fieldA = new Validator("typeA")
		const validator = new ArrayValidator(new ObjectValidator({ fieldA }))

		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", true)
		expect(compiledObject).toHaveProperty("data.type", "array")
		expect(compiledObject).toHaveProperty("data.defaultField.required", true)
		expect(compiledObject).toHaveProperty("data.defaultField.type", "object")
		expect(compiledObject).toHaveProperty("data.defaultField.fields.fieldA.required", true)
		expect(compiledObject).toHaveProperty("data.defaultField.fields.fieldA.type", "typeA")
		expect(compiledObject).toHaveProperty("meta.transformer")
	})

	it("can run nested transformer", async () => {
		const innerMostTranformer = jest.fn()
		const fieldA = new Validator("typeB")
		fieldA.transformBy(innerMostTranformer)
		const validator = new ArrayValidator(new ObjectValidator({ fieldA }))
		const compiledObject = validator.compiledObject

		compiledObject.meta.transformer!([ { fieldA: "world" } ])

		expect(innerMostTranformer).toHaveBeenCalled()
		expect(innerMostTranformer.mock.calls[0]).toEqual([ "world" ])
	})

	it("can run nested transformer on multiple values", async () => {
		const innerMostTranformer = jest.fn()
		const fieldA = new Validator("typeC")
		fieldA.transformBy(innerMostTranformer)
		const validator = new ArrayValidator(new ObjectValidator({ fieldA }))
		const compiledObject = validator.compiledObject

		compiledObject.meta.transformer!([ { fieldA: "world" }, { fieldA: "bar" } ])

		expect(innerMostTranformer).toHaveBeenCalled()
		expect(innerMostTranformer.mock.calls[0]).toEqual([ "world" ])
		expect(innerMostTranformer.mock.calls[1]).toEqual([ "bar" ])
	})

	it("can transformer ignore invalid types", async () => {
		const innerMostTranformer = jest.fn()
		const fieldA = new Validator("typeC")
		fieldA.transformBy(innerMostTranformer)
		const validator = new ArrayValidator(new ObjectValidator({ fieldA }))
		const compiledObject = validator.compiledObject

		compiledObject.meta.transformer!(23)

		expect(innerMostTranformer).not.toHaveBeenCalled()
	})
})
