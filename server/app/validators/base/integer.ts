import type { ValidationConstraints } from "!/types/dependent"

/**
 * Validator to check if data is a valid integer
 */
export default async function(
	currentState: Promise<any>,
	constraints: ValidationConstraints
): Promise<any> {
	const value = await currentState

	const parsedValue = Number(value)

	if (Number.isInteger(parsedValue)) {
		return parsedValue
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be an integer.`
		}
	}
}
