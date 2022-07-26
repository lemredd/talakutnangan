import type { FieldRules } from "!/types/independent"
import MockRequester from "~/set-ups/mock_requester"
import required from "!/app/validators/base/required"
import string from "!/app/validators/base/string"
import integer from "!/app/validators/base/integer"
import validate from "./validate"

describe("Validator: validate", () => {
	const requester = new MockRequester()

	it("can accept valid input", async () => {
		const input = {
			hello: "world",
			foo: 42
		}
		const rules: FieldRules = {
			hello: {
				pipes: [ required, string ],
				constraints: {}
			},
			foo: {
				pipes: [ required, integer ],
				constraints: {}
			}
		}

		const sanitizeValue = await requester.runValidator(validate, rules, input)

		expect(sanitizeValue).toStrictEqual(input)
	})

	it("can check missing inputs", async () => {
		const mockValidator = jest.fn(value => value)
		const input = {}
		const rules: FieldRules = {
			hello: {
				pipes: [ mockValidator ],
				constraints: {}
			}
		}

		const sanitizeValue = await requester.runValidator(validate, rules, input)

		expect(mockValidator).toHaveBeenCalled()
		expect(mockValidator.mock.calls[0]).toEqual([ undefined ])
	})

	it("cannot accept invalid input", async () => {
		const input = {
			hello: "world",
			foo: 42
		}
		const rules: FieldRules = {
			hello: {
				pipes: [ required, integer ],
				constraints: {}
			},
			foo: {
				pipes: [ required, string ],
				constraints: {}
			}
		}

		const errors = requester.runValidator(validate, rules, input)

		expect(errors).rejects.toHaveLength(2)
		expect(errors).rejects.toHaveProperty("0.field", "hello")
		expect(errors).rejects.toHaveProperty("1.field", "foo")
	})
})
