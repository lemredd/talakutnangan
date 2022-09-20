import type { Request } from "!/types/dependent"

import "~/set-ups/database.setup"
import UserManager from "%/managers/user"
import UserFactory from "~/factories/user"
import makeInitialState from "!/validators/make_initial_state"
import present from "./present"

describe("Validator: present", () => {
	it("can accept valid input", async () => {
		const user = await new UserFactory().insertOne()
		const value = Promise.resolve(makeInitialState(user.name))
		const constraints = {
			request: {} as Request,
			source: {
				id: user.id+""
			},
			field: "hello",
			manager: {
				className: UserManager,
				columnName: "name"
			}
		}

		const sanitizeValue = (await present(value, constraints)).value

		expect(sanitizeValue).toEqual(user.name)
	})

	it("can accept archived value", async () => {
		const user = await new UserFactory().insertOne()
		const value = Promise.resolve(makeInitialState(user.name))
		const constraints = {
			request: {} as Request,
			source: {
				id: user.id+""
			},
			field: "hello",
			manager: {
				className: UserManager,
				columnName: "name"
			}
		}
		await user.destroy({ force: false })

		const sanitizeValue = (await present(value, constraints)).value

		expect(sanitizeValue).toEqual(user.name)
	})

	it("cannot accept absent value", async () => {
		const user = await new UserFactory().insertOne()
		const value = Promise.resolve(makeInitialState(user.name))
		const constraints = {
			request: {} as Request,
			source: {
				id: user.id+""
			},
			field: "hello",
			manager: {
				className: UserManager,
				columnName: "name"
			}
		}
		await user.destroy({ force: true })

		const error = present(value, constraints)
		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
