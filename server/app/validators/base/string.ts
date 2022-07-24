import type { ValidationConstraints } from "!/types/dependent"

import isString from "lodash.isstring"

/**
 * Validator to check if data is a valid string
 */
export default async function(
	currentState: Promise<any>,
	constraints: ValidationConstraints
): Promise<any> {
	const value = await currentState

	if (isString(value)) {
		return value
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be a string.`
		}
	}
}
