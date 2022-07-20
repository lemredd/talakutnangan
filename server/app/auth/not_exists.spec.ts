import type { Validator } from "node-input-validator"
import UserManager from "%/managers/user"
import UserFactory from "~/factories/user"
import notExists from "./not_exists"

describe("Validator: Not exists", () => {
	it("can validate normal absence", async () => {
		const validator = {}
		const value = "Hello world!"
		const args = [ UserManager, "name" ]

		const isValid = await notExists({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("cannot validate present", async () => {
		const user = await (new UserFactory()).insertOne()
		const validator = {}
		const value = user.name
		const args = [ UserManager, "name" ]

		const isValid = await notExists({ value, args }, validator as Validator)

		expect(isValid).toBeFalsy()
	})

	it("should error on insuffiencient arguments", () => {
		const validator = {}
		const value = null
		const args: any[] = []

		expect(() => notExists({ value, args }, validator as Validator)).rejects.toThrow()
	})

	it("should error on un-instantiable manager", () => {
		const validator = {}
		const value = null
		const args = [ null, "name" ]

		expect(() => notExists({ value, args }, validator as Validator)).rejects.toThrow()
	})

	it("skips undefined", async () => {
		const validator = {}
		const value = undefined
		const args = [ UserManager, "name" ]

		const isValid = await notExists({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})
})
