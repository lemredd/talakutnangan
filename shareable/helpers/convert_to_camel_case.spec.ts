import convertToCamelCase from "./convert_to_camel_case"

describe("Helpers: Camel Case", () => {
	it("can convert words with initial uppercase letter", () => {
		const value = "Name"

		const result = convertToCamelCase(value)

		expect(result).toBe("name")
	})

	it("can convert words with initial uppercase letter and whitespace separated", () => {
		const value = "Student Number"

		const result = convertToCamelCase(value)

		expect(result).toBe("studentNumber")
	})
})
