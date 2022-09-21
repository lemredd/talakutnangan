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

		const error = notExists(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
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

		const error = notExists(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
