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
		expect(mockValidator.mock.calls[0][0]).resolves.toEqual({
			"maySkip": false,
			"value": undefined
		})
	})

	it("cannot accept invalid input", () => {
		const input = {
			"hello": "world",
			"foo": 42
		}
		const rules: FieldRules = {
			"hello": {
				"pipes": [ required, integer ],
				"constraints": {}
			},
			"foo": {
				"pipes": [ required, string ],
				"constraints": {}
			}
		}

		const errors = requester.runValidator(validate, rules, input)

		expect(errors).rejects.toHaveLength(2)
		expect(errors).rejects.toHaveProperty("0.field", "foo")
		expect(errors).rejects.toHaveProperty("1.field", "hello")
	})
})
