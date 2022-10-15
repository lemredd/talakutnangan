import type { AuthenticatedRequest } from "!/types/dependent"

import "~/setups/database.setup"
import UserFactory from "~/factories/user"
import makeInitialState from "!/validators/make_initial_state"
import matchesPassword from "./matches_password"

describe("Validator: matches password", () => {
	it("can accept valid input", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const value = Promise.resolve(makeInitialState(password))
		const constraints = {
			"request": {
				"user": profile
			} as AuthenticatedRequest,
			"source": null,
			"field": "hello"
		}

		const sanitizeValue = (await matchesPassword(value, constraints)).value

		expect(sanitizeValue).toEqual(password)
	})

	it("cannot accept invalid value", async() => {
		const { password, profile } = await new UserFactory().insertProfile()
		const value = Promise.resolve(makeInitialState(`${password}1`))
		const constraints = {
			"request": {
				"user": profile
			} as AuthenticatedRequest,
			"source": null,
			"field": "hello"
		}

		try {
			await matchesPassword(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
