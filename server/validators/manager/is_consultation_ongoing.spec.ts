import type { AuthenticatedRequest } from "!/types/dependent"
import type { ValidationConstraints } from "!/types/validation"

import "~/setups/database.setup"
import Factory from "~/factories/consultation"

import makeInitialState from "!/validators/make_initial_state"

import validator from "./is_consultation_ongoing"

describe("Validator: is consultation ongoing", () => {
	it("can accept valid input", async() => {
		const model = await new Factory()
		.startedAt(() => new Date())
		.finishedAt(() => null)
		.insertOne()
		const value = Promise.resolve(makeInitialState(model.id))
		const constraints = {
			"field": "hello",
			"request": {} as AuthenticatedRequest,
			"source": {}
		} as unknown as ValidationConstraints<AuthenticatedRequest>

		const sanitizeValue = (await validator(value, constraints)).value

		expect(sanitizeValue).toEqual(model.id)
	})

	it("cannot accept invalid value", async() => {
		const model = await new Factory()
		.startedAt(() => null)
		.finishedAt(() => null)
		.insertOne()
		const value = Promise.resolve(makeInitialState(model.id))
		const constraints = {
			"field": "hello",
			"request": {} as AuthenticatedRequest,
			"source": {}
		} as unknown as ValidationConstraints<AuthenticatedRequest>

		try {
			await validator(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
