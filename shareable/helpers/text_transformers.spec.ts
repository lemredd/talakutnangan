import TextTransformer from "$/helpers/text_transformers"

describe("Helper: Text Transformer", () => {
	const transformText = new TextTransformer()

	describe("Transforming to sentence-case", () => {
		it("should transform from a string to sentence-case", () => {
			const camelCasedWord = "helloWorld"
			const sentenceCasedWord = "Hello world"
			expect(transformText.toSentenceCase(camelCasedWord)).toEqual(sentenceCasedWord)
		})
	})

	describe("Transforming to param-case", () => {
		it("should transform a string to param-case", () => {
			const camelCasedWord = "helloWorld"
			const sentenceCasedWord = "Hello world"
			const paramCasedWord = "hello-world"

			expect(transformText.toParamCase(sentenceCasedWord)).toEqual(paramCasedWord)
			expect(transformText.toParamCase(camelCasedWord)).toEqual(paramCasedWord)
		})
	})
})
