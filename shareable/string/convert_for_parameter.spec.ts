import convertForParameter from "./convert_for_parameter"

describe("String: Parameter case", () => {
	it("should convert from camel case to parameter case", () => {
		const camelCasedWord = "helloWorld"
		const parameterCasedWord = "hello-world"

		const result = convertForParameter(camelCasedWord)

		expect(result).toBe(parameterCasedWord)
	})

	it("should convert from sentence case to parameter case", () => {
		const sentenceCasedWord = "Hello world"
		const parameterCasedWord = "hello-world"

		const result = convertForParameter(sentenceCasedWord)

		expect(result).toBe(parameterCasedWord)
	})
})
