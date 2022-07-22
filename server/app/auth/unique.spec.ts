import type { Validator } from "node-input-validator"
import UserManager from "%/managers/user"
import UserFactory from "~/factories/user"
import unique from "./unique"

describe("Validator: Unique", () => {
	it("can validate uniqueness by absence in database", async () => {
		const user = await (new UserFactory()).makeOne()
		const validator = {}
		const value = user.name
		const args = [ UserManager, "name", "" ]

		const isValid = await unique({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("can validate uniqueness by same ID in the database", async () => {
		const user = await (new UserFactory()).insertOne()
		const validator = {
			inputs: {
				data: {
					id: user.id
				}
			}
		}
		const value = user.name
		const args = [ UserManager, "name", "data.id" ]

		const isValid = await unique({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})

	it("should error on insuffiencient arguments", () => {
		const validator = {}
		const value = null
		const args: any[] = []

		expect(() => unique({ value, args }, validator as Validator)).rejects.toThrow()
	})

	it("should error on un-instantiable manager", () => {
		const validator = {}
		const value = null
		const args = [ null, "name", "" ]

		expect(() => unique({ value, args }, validator as Validator)).rejects.toThrow()
	})

	it("skips undefined", async () => {
		const validator = {}
		const value = undefined
		const args = [ UserManager, "name", "" ]

		const isValid = await unique({ value, args }, validator as Validator)

		expect(isValid).toBeTruthy()
	})
})
