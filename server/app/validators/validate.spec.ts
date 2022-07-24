import ArrayValidator from "!/app/validators/base/array"
import ObjectValidator from "!/app/validators/base/object"
import EqualString from "!/app/validators/comparison/equal_string"
import validate from "./validate"

describe("Validator: Validate", () => {
	it("can accept valid info", async () => {
		const descriptor = { hello: new EqualString("world") }
		const input = { hello: "world" }

		const validatedInfo = await validate(descriptor, input)

		expect(validatedInfo).toStrictEqual(validatedInfo)
	})

	it("cannot accept invalid info", async () => {
		const descriptor = { hello: new EqualString("world") }
		const input = { hello: "world!" }

		const error = validate(descriptor, input)

		expect(error).rejects.toHaveProperty("0.field", "hello")
	})

	it("can accept multiple valid info", async () => {
		const descriptor = { hello: new EqualString("world"), foo: new EqualString("bar") }
		const input = { hello: "world", foo: "bar" }

		const validatedInfo = await validate(descriptor, input)

		expect(validatedInfo).toStrictEqual(validatedInfo)
	})

	it("cannot accept multiple invalid info", async () => {
		const descriptor = { hello: new EqualString("world"), foo: new EqualString("bar") }
		const input = { hello: "world!", foo: "baz" }

		const error = validate(descriptor, input)

		expect(error).rejects.toHaveLength(2)
		expect(error).rejects.toHaveProperty("0.field", "hello")
		expect(error).rejects.toHaveProperty("1.field", "foo")
	})

	it("can accept valid nested info", async () => {
		const descriptor = {
			data: new ArrayValidator(
				new ObjectValidator({
					type: new EqualString("department"),
					id: new EqualString("0"),
				})
			)
		}
		const input = {
			data: [
				{
					type: "department",
					id: "0"
				}
			]
		}

		const validatedInfo = await validate(descriptor, input)

		expect(validatedInfo).toStrictEqual(validatedInfo)
	})
})
