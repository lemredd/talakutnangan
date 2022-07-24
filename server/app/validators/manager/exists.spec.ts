import UserManager from "%/managers/user"
import UserFactory from "~/factories/user"
import Validator from "./exists"

describe("Validator: Exists Validator", () => {
	it("can make string data", async () => {
		const validator = new Validator("string", UserManager, "name")

		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", true)
		expect(compiledObject).toHaveProperty("data.type", "string")
		expect(compiledObject).toHaveProperty("data.asyncValidator")
		expect(compiledObject).toHaveProperty("meta.transformer")
	})

	it("can make integer data", async () => {
		const validator = new Validator("integer", UserManager, "id")

		const compiledObject = validator.compiledObject

		expect(compiledObject).toHaveProperty("data.required", true)
		expect(compiledObject).toHaveProperty("data.type", "integer")
		expect(compiledObject).toHaveProperty("data.asyncValidator")
		expect(compiledObject).toHaveProperty("meta.transformer")
	})

	it("can accept valid value", async () => {
		const user = await (new UserFactory()).insertOne()
		const validator = new Validator("string", UserManager, "name")
		const compiledObject = validator.compiledObject
		const callback = jest.fn()

		await compiledObject.data.asyncValidator!(null, user.name, callback)

		expect(callback).toHaveBeenCalled()
		expect(callback.mock.calls[0]).toEqual([])
	})

	it("cannot accept archived value", async () => {
		const user = await (new UserFactory()).insertOne()
		const validator = new Validator("string", UserManager, "name")
		const compiledObject = validator.compiledObject
		const callback = jest.fn()
		await user.destroy({ force: false })

		await compiledObject.data.asyncValidator!(null, user.name, callback)

		expect(callback).toHaveBeenCalled()
		expect(callback.mock.calls[0]).not.toEqual([])
	})

	it("cannot accept invalid value", async () => {
		const validator = new Validator("string", UserManager, "name")
		const compiledObject = validator.compiledObject
		const callback = jest.fn()

		await compiledObject.data.asyncValidator!(null, "hello", callback)

		expect(callback).toHaveBeenCalled()
		expect(callback.mock.calls[0]).not.toEqual([])
	})
})
