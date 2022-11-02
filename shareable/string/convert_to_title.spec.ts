import convertToTitle from "./convert_to_title"

describe("Helpers: Title Case", () => {
	it("can convert words with initial uppercase letter", () => {
		const value = "name"

		const result = convertToTitle(value)

		expect(result).toBe("Name")
	})

	it("can convert words with initial uppercase letter and whitespace separated", () => {
		const value = "student number"

		const result = convertToTitle(value)

		expect(result).toBe("Student Number")
	})
})
