import camel_to_sentence from "./camel_to_sentence"
import camelToSentence from "./camel_to_sentence"

describe("Helper: Text transformer from camel-case to sentence-case", () => {
	it("should transform from camel-case to sentence-case", async() => {
		const camelCasedWord = "helloWorld"
		const sentenceCasedWord = "Hello world"

		expect(camelToSentence(camelCasedWord)).toEqual(sentenceCasedWord)
	})
})
