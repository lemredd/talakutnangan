import {
	sentenceCase,
	paramCase
 } from "text-case"

 export default class TextTransformer {
	toSentenceCase(text: string): string {
		return sentenceCase(text)
	}

	toParamCase(text: string): string {
		return paramCase(text)
	}
 }
