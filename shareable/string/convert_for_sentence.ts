import { sentenceCase } from "text-case"

/**
 * Converts the string to sentence case.
 * @param value String to convert
 */
export default function(value: string): string {
	return sentenceCase(value)
}
