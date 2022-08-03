import makeInitialState from "!/validators/make_initial_state"
import same from "./same"

describe("Validator pipe: same", () => {
	it("can accept valid input", async () => {
		const value = Promise.resolve(makeInitialState("world"))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			same: {
				value: "world"
			}
		}

		const sanitizeValue = (await same(value, constraints)).value

		expect(sanitizeValue).toEqual("world")
	})

	it("cannot accept invalid input", async () => {
		const value = Promise.resolve(makeInitialState("foo"))
		const constraints = {
			request: null,
			source: null,
			field: "hello",
			same: {
				value: "world"
			}
		}

		const error = same(value, constraints)

		expect(error).rejects.toHaveProperty("field", "hello")
		expect(error).rejects.toHaveProperty("messageMaker")
	})
})