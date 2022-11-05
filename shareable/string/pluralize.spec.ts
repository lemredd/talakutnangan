import helper from "./pluralize"

describe("String helper: Pluralize", () => {
	it("should pluralize 0 quantity", async() => {
		const noun = "comment"
		const quantity = 0

		const result = helper(noun, quantity)

		expect(result).toBe("0 comments")
	})

	it("should singularize 1 quantity", async() => {
		const noun = "comment"
		const quantity = 1

		const result = helper(noun, quantity)

		expect(result).toBe("1 comment")
	})

	it("should pluralize 2 quantity", async() => {
		const noun = "comment"
		const quantity = 2

		const result = helper(noun, quantity)

		expect(result).toBe("2 comments")
	})
})
