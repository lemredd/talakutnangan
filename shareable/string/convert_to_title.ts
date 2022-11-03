import { titleCase } from "text-case"

/**
 * Converts the string to title case.
 * @param value String to convert
 */
export default function(value: string): string {
	return titleCase(value)
}
