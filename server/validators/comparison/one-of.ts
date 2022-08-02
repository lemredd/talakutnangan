import type {
	ValidationState,
	ValidationConstraints,
	OneOfRuleConstraints
} from "!/types/validation"

import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if is in the possible enumerated values.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<OneOfRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.oneOf === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	const values = constraints.oneOf.values

	if (values.includes(state.value)) {
		return state
	} else {
		throw {
			field: constraints.field,
			messageMaker: (field: string) => `Field "${field}" must be one of these: ${
				values.map(value => `"${value}"`).join(", ")
			}".`
		}
	}
}
