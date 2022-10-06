import type { AuthenticatedRequest } from "!/types/dependent"

import makeInitialState from "!/validators/make_initial_state"
import isOneOfTheParticipant from "./is_one_of_the_participant"

describe("Validator: Is one of the participant", () => {
	it("can accept valid input", async() => {
		const id = "1"
		const value = Promise.resolve(makeInitialState([ { id } ]))
		const constraints = {
			"field": "hello",
			"request": {
				"user": {
					"data": {
						id
					}
				}
			} as unknown as AuthenticatedRequest,
			"source": null
		}

		const sanitizeValue = (await isOneOfTheParticipant(value, constraints)).value

		expect(sanitizeValue).toEqual([ { id } ])
	})

	it("cannot accept invalid value", async() => {
		const id = "1"
		const value = Promise.resolve(makeInitialState([ { id } ]))
		const constraints = {
			"field": "hello",
			"request": {
				"user": {
					"data": {
						"id": 2
					}
				}
			} as unknown as AuthenticatedRequest,
			"source": null
		}

		try {
			await isOneOfTheParticipant(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
