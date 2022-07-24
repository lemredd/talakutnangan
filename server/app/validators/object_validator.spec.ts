import BaseValidator from "!/app/validators/validator"

import ObjectValidator from "./object_validator"

class Validator extends BaseValidator {}

describe("Validator: Base Validator", () => {
	it("can make normal data", async () => {
		const fieldA = new Validator("typeA")
		const validator = new ObjectValidator({ fieldA })

		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", true)
		expect(compiledObject).toHaveProperty("data.type", "object")
		expect(compiledObject).toHaveProperty("data.fields.fieldA.required", true)
		expect(compiledObject).toHaveProperty("data.fields.fieldA.type", "typeA")
		expect(compiledObject).toHaveProperty("meta.transformer")
	})

	it("can run nested transformer", async () => {
		const innerMostTranformer = jest.fn()
		const fieldA = new Validator("typeB")
		fieldA.transformBy(innerMostTranformer)
		const validator = new ObjectValidator({ fieldA })
		const compiledObject = validator.compiledObject

		compiledObject.meta.transformer!({ fieldA: "world" })

		expect(innerMostTranformer).toHaveBeenCalled()
		expect(innerMostTranformer.mock.calls[0]).toEqual([ "world" ])
	})
})
