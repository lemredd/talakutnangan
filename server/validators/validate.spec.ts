/* eslint-disable no-undefined */
import type { FieldRules } from "!/types/validation"
import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import required from "!/validators/base/required"
import MockRequester from "~/setups/mock_requester"
import validate from "./validate"

describe("Validator: validate", () => {
	const requester = new MockRequester()

	it("can accept valid input", async() => {
		const input = {
			"hello": "world",
			"foo": 42
		}
		const rules: FieldRules = {
			"hello": {
				"pipes": [ required, string ],
				"constraints": {}
			},
			"foo": {
				"pipes": [ required, integer ],
				"constraints": {}
			}
		}

		const sanitizeValue = await requester.runValidator(validate, rules, input)

		expect(sanitizeValue).toStrictEqual(input)
	})

	it("can check missing inputs", async() => {
		const mockValidator = jest.fn(value => value)
		const input = {}
		const rules: FieldRules = {
			"hello": {
				"constraints": {},
				"pipes": [ mockValidator ]
			}
		}

		await requester.runValidator(validate, rules, input)

		expect(mockValidator).toHaveBeenCalled()
		expect(await mockValidator.mock.calls[0][0]).toEqual({
			"maySkip": false,
			"value": undefined
		})
	})

	it("cannot accept invalid input but with friendly name", async() => {
		const input = {
			"foo": 42,
			"hello": "world"
		}
		const rules: FieldRules = {
			"foo": {
				"constraints": {},
				"friendlyName": "bar",
				"pipes": [ required, string ]
			},
			"hello": {
				"constraints": {},
				"friendlyName": "world",
				"pipes": [ required, integer ]
			}
		}

		try {
			await requester.runValidator(validate, rules, input)
		} catch (errors) {
			expect(errors).toHaveLength(2)
			expect(errors).toHaveProperty("0.friendlyName", "bar")
			expect(errors).toHaveProperty("1.friendlyName", "world")
		}
	})

	it("cannot accept invalid input", async() => {
		const input = {
			"foo": 42,
			"hello": "world"
		}
		const rules: FieldRules = {
			"foo": {
				"constraints": {},
				"pipes": [ required, string ]
			},
			"hello": {
				"constraints": {},
				"pipes": [ required, integer ]
			}
		}

		try {
			await requester.runValidator(validate, rules, input)
		} catch (errors) {
			expect(errors).toHaveLength(2)
			expect(errors).toHaveProperty("0.field", "foo")
			expect(errors).toHaveProperty("1.field", "hello")
		}
	})
})
