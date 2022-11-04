import convertToCamel from "./convert_to_camel"

describe("Helpers: Camel Case", () => {
	it("can convert words with initial uppercase letter", () => {
		const value = "Name"

		const result = convertToCamel(value)

		expect(result).toBe("name")
	})

	it("can convert words with initial uppercase letter and whitespace separated", () => {
		const value = "Student Number"
		const value2 = "Student Number2"

		const result = convertToCamel(value)
		const result2 = convertToCamel(value2)

		expect(result).toBe("studentNumber")
		expect(result2).toBe("studentNumber2")
	})
})
