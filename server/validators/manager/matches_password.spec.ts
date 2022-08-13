import type { AuthenticatedRequest } from "!/types/dependent"

import "~/set-ups/database.set_up"
import UserFactory from "~/factories/user"
import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"
import makeInitialState from "!/validators/make_initial_state"
import matchesPassword from "./matches_password"

describe("Validator: matches password", () => {
	it("can accept valid input", async() => {
		const user = await new UserFactory().insertOne()
		const { password } = user
		const value = Promise.resolve(makeInitialState(password))
		const constraints = {
			"request": {
				"user": Serializer.serialize(user, new UserTransformer(), {})
			} as AuthenticatedRequest,
			"source": null,
			"field": "hello"
		}

		const sanitizeValue = (await matchesPassword(value, constraints)).value

		expect(sanitizeValue).toEqual(password)
	})

	it("cannot accept invalid value", async() => {
		const user = await new UserFactory().insertOne()
		const { password } = user
		const value = Promise.resolve(makeInitialState(`${password}1`))
		const constraints = {
			"request": {
				"user": Serializer.serialize(user, new UserTransformer(), {})
			} as AuthenticatedRequest,
			"source": null,
			"field": "hello"
		}

		const error = matchesPassword(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})
