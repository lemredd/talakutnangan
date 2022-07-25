import type { Validator } from "node-input-validator"
import UserManager from "%/managers/user"
import UserFactory from "~/factories/user"
import archived from "./archived"

describe("Validator: Archived", () => {
	it("can validate normal non-existence", async () => {
		const user = await (new UserFactory()).insertOne()
		const validator = {}
		const value = user.id
		const args = [ UserManager ]
		await user.destroy()

		const isValid = await archived({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("cannot validate normal existence", async () => {
		const user = await (new UserFactory()).insertOne()
		const validator = {}
		const value = user.id
		const args = [ UserManager ]

		const isValid = await archived({ value, args }, validator as Validator)

		expect(isValid).toBeFalsy()
	})

	it("cannot validate absence", async () => {
		const validator = {}
		const value = 1
		const args = [ UserManager ]

		const isValid = await archived({ value, args }, validator as Validator)

		expect(isValid).toBeFalsy()
	})

	it("should error on insuffiencient arguments", () => {
		const validator = {}
		const value = null
		const args: any[] = []

		expect(() => archived({ value, args }, validator as Validator)).rejects.toThrow()
	})

	it("should error on un-instantiable manager", () => {
		const validator = {}
		const value = null
		const args = [ null ]

		expect(() => archived({ value, args }, validator as Validator)).rejects.toThrow()
	})

	it("skips undefined", async () => {
		const validator = {}
		const value = undefined
		const args = [ UserManager ]

		const isValid = await archived({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})
})
