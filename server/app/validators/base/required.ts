import type { ValidationConstraints } from "!/types/dependent"

/**
 * Validator to require the data
 */
export default async function(
	currentState: Promise<any>,
	constraints: ValidationConstraints
): Promise<any> {
	const value = await currentState

	if (value) {
		return value
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" is required.`
		}
	}
}
