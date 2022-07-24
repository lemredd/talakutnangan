import type { ValidationConstraints, SameRuleConstraints } from "!/types/independent"

/**
 * Validator to check if data is the same as the data passed
 */
export default async function(
	currentState: Promise<any>,
	constraints: ValidationConstraints & SameRuleConstraints
): Promise<any> {
	const value = await currentState

	if (!constraints.same || (value === constraints.same)) {
		return value
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be a string.`
		}
	}
}
