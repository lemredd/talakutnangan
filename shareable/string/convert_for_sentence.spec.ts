import convertForSentence from "./convert_for_sentence"

describe("String: Sentence case", () => {
	it("should convert to sentence case", () => {
		const camelCasedWord = "helloWorld"
		const sentenceCasedWord = "Hello world"

		const result = convertForSentence(camelCasedWord)

		expect(result).toBe(sentenceCasedWord)
	})
})
