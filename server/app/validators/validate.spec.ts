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
			hello: [ required, string ],
			foo: [ required, integer ]
		}

		const sanitizeValue = await requester.runValidator(validate, rules, input)

		expect(sanitizeValue).toStrictEqual(input)
	})

	it("cannot accept invalid input", async () => {
		const input = {
			hello: "world",
			foo: 42
		}
		const rules: FieldRules = {
			hello: [ required, integer ],
			foo: [ required, string ]
		}

		const errors = requester.runValidator(validate, rules, input)

		expect(errors).rejects.toHaveLength(2)
		expect(errors).rejects.toHaveProperty("0.field", "hello")
		expect(errors).rejects.toHaveProperty("1.field", "foo")
	})
})
