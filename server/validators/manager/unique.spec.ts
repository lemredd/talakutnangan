import type { Request } from "!/types/dependent"

import "~/setups/database.setup"
import UserManager from "%/managers/user"
import UserFactory from "~/factories/user"
import makeInitialState from "!/validators/make_initial_state"
import unique from "./unique"

describe("Validator: unique", () => {
	it("can accept valid input", async() => {
		const user = await new UserFactory().insertOne()
		const newUser = await new UserFactory().makeOne()
		const value = Promise.resolve(makeInitialState(newUser.name))
		const constraints = {
			"request": {} as Request,
			"source": {
				"id": `${user.id}`
			},
			"field": "hello",
			"manager": {
				"className": UserManager,
				"columnName": "name"
			},
			"unique": {
				"IDPath": "id"
			}
		}

		const sanitizeValue = (await unique(value, constraints)).value

		expect(sanitizeValue).toEqual(newUser.name)
	})

	it("cannot accept existing value", async() => {
		const user = await new UserFactory().insertOne()
		const newUser = await new UserFactory().insertOne()
		const value = Promise.resolve(makeInitialState(newUser.name))
		const constraints = {
			"request": {} as Request,
			"source": {
				"id": `${user.id}`
			},
			"field": "hello",
			"manager": {
				"className": UserManager,
				"columnName": "name"
			},
			"unique": {
				"IDPath": "id"
			}
		}

		try {
			await unique(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})

	it("cannot accept archived value", async() => {
		const user = await new UserFactory().insertOne()
		const newUser = await new UserFactory().insertOne()
		const value = Promise.resolve(makeInitialState(newUser.name))
		const constraints = {
			"request": {} as Request,
			"source": {
				"id": `${user.id}`
			},
			"field": "hello",
			"manager": {
				"className": UserManager,
				"columnName": "name"
			},
			"unique": {
				"IDPath": "id"
			}
		}
		await newUser.destroy({ "force": false })

		try {
			await unique(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
