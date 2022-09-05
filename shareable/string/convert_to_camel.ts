import { camelCase } from "text-case"

/**
 * Converts the string to camel case.
 * @param value String to convert
 */
export default function(value: string): string {
	return camelCase(value)
}
