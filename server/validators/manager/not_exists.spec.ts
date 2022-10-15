import type { Request } from "!/types/dependent"

import "~/setups/database.setup"
import UserManager from "%/managers/user"
import UserFactory from "~/factories/user"
import makeInitialState from "!/validators/make_initial_state"
import notExists from "./not_exists"

describe("Validator: not exists", () => {
	it("can accept valid input", async() => {
		const user = "hello"
		const value = Promise.resolve(makeInitialState(user))
		const constraints = {
			"request": {} as Request,
			"source": null,
			"field": "hello",
			"manager": {
				"className": UserManager,
				"columnName": "name"
			}
		}

		const sanitizeValue = (await notExists(value, constraints)).value

		expect(sanitizeValue).toEqual(user)
	})

	it("cannot accept archived value", async() => {
		const user = await new UserFactory().insertOne()
		const value = Promise.resolve(makeInitialState(user.name))
		const constraints = {
			"request": {} as Request,
			"source": null,
			"field": "hello",
			"manager": {
				"className": UserManager,
				"columnName": "name"
			}
		}
		await user.destroy({ "force": false })

		try {
			await notExists(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})

	it("cannot accept invalid value", async() => {
		const user = await new UserFactory().insertOne()
		const value = Promise.resolve(makeInitialState(user.name))
		const constraints = {
			"request": {} as Request,
			"source": null,
			"field": "hello",
			"manager": {
				"className": UserManager,
				"columnName": "name"
			}
		}

		try {
			await notExists(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
