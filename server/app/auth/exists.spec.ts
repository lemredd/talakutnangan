import type { Validator } from "node-input-validator"
import UserManager from "%/managers/user"
import UserFactory from "~/factories/user"
import exists from "./exists"

describe("Validator: Exists", () => {
	it("can validate normal existence", async () => {
		const user = await (new UserFactory()).insertOne()
		const validator = {}
		const value = user.name
		const args = [ UserManager, "name" ]

		const isValid = await exists({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("cannot validate non-existence", async () => {
		const user = await (new UserFactory()).insertOne()
		const validator = {}
		const value = user.name
		const args = [ UserManager, "name" ]
		await user.destroy({ force: false })

		const isValid = await exists({ value, args }, validator as Validator)

		expect(isValid).toBeFalsy()
	})

	it("cannot validate absence", async () => {
		const validator = {}
		const value = "Hello world!"
		const args = [ UserManager, "name" ]

		const isValid = await exists({ value, args }, validator as Validator)

		expect(isValid).toBeFalsy()
	})

	it("should error on insuffiencient arguments", () => {
		const validator = {}
		const value = null
		const args: any[] = []

		expect(() => exists({ value, args }, validator as Validator)).rejects.toThrow()
	})

	it("should error on un-instantiable manager", () => {
		const validator = {}
		const value = null
		const args = [ null, "name" ]

		expect(() => exists({ value, args }, validator as Validator)).rejects.toThrow()
	})

	it("skips undefined", async () => {
		const validator = {}
		const value = undefined
		const args = [ UserManager, "name" ]

		const isValid = await exists({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})
})
