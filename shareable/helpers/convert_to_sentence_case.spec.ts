import convertToSentenceCase from "./convert_to_sentence_case"

describe("Helper: Text transformer from camel-case to sentence-case", () => {
	it("should transform from camel-case to sentence-case", () => {
		const camelCasedWord = "helloWorld"
		const sentenceCasedWord = "Hello world"

		expect(convertToSentenceCase(camelCasedWord)).toEqual(sentenceCasedWord)
	})
})
