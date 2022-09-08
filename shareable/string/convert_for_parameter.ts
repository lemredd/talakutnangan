import { paramCase } from "text-case"

/**
 * Converts the string to parameter case.
 * @param value String to convert
 */
export default function(value: string): string {
	return paramCase(value)
}
