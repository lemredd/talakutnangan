import isUniqueIDList from "./unique_identifier_list"
import makeInitialState from "!/validators/make_initial_state"
import type { ValidationConstraints } from "!/types/validation"

describe("Validator: Is unique identifier list", () => {
	it("can accept valid input", async() => {
		const identifiers = [
			{
				"id": "1",
				"type": "user"
			},
			{
				"id": "2",
				"type": "user"
			}
		]

		const value = Promise.resolve(makeInitialState(identifiers))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		} as unknown as ValidationConstraints

		const sanitizeValue = (await isUniqueIDList(value, constraints)).value

		expect(sanitizeValue).toEqual(identifiers)
	})

	it("cannot accept invalid value", async() => {
		const identifiers = [
			{
				"id": "1",
				"type": "user"
			},
			{
				"id": "2",
				"type": "user"
			},
			{
				"id": "1",
				"type": "user"
			}
		]

		const value = Promise.resolve(makeInitialState([ { identifiers } ]))
		const constraints = {
			"field": "hello",
			"request": null,
			"source": null
		} as unknown as ValidationConstraints

		try {
			await isUniqueIDList(value, constraints)
		} catch (error) {
			expect(error).toHaveProperty("field", "hello")
			expect(error).toHaveProperty("messageMaker")
		}
	})
})
