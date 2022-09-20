import type { Request } from "!/types/dependent"

import "~/set-ups/database.setup"
import UserManager from "%/managers/user"
import UserFactory from "~/factories/user"
import makeInitialState from "!/validators/make_initial_state"
import archived from "./archived"

describe("Validator: archived", () => {
	it("can accept valid input", async () => {
		const user = await (new UserFactory()).insertOne()
		const value = Promise.resolve(makeInitialState(user.name))
		const constraints = {
			request: {} as Request,
			source: null,
			field: "hello",
			manager: {
				className: UserManager,
				columnName: "name"
			}
		}
		await user.destroy({ force: false })

		const sanitizeValue = (await archived(value, constraints)).value

		expect(sanitizeValue).toEqual(user.name)
	})

	it("cannot accept existing value", async () => {
		const user = await (new UserFactory()).insertOne()
		const value = Promise.resolve(makeInitialState(user.name))
		const constraints = {
			request: {} as Request,
			source: null,
			field: "hello",
			manager: {
				className: UserManager,
				columnName: "name"
			}
		}

		const error = archived(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})

	it("cannot accept invalid value", async () => {
		const user = "hello"
		const value = Promise.resolve(makeInitialState(user))
		const constraints = {
			request: {} as Request,
			source: null,
			field: "hello",
			manager: {
				className: UserManager,
				columnName: "name"
			}
		}

		const error = archived(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
