import type {
	ValidationState,
	ValidationConstraints,
	SameRuleConstraints
} from "!/types/validation"

import accessDeepPath from "$!/helpers/access_deep_path"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if data is the same as the data passed.
 *
 * If it will be compared to a pointed value, it will be a loose comparison. Otherwise, it is
 * strict-type comparison.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<SameRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if(state.maySkip) return state

	if (constraints.same === undefined) {
		throw makeDeveloperError(constraints.field)
	}

	if (constraints.same.value !== undefined) {
		if (state.value === constraints.same.value) {
			return state
		} else {
			throw {
				field: constraints.field,
				messageMaker: (field: string) => `Field "${field}" must be "${
					constraints.same?.value
				}".`
			}
		}
	} else if (constraints.same.pointer !== undefined ) {
		const accessedValue = accessDeepPath(constraints.source, constraints.same.pointer)
		if (state.value == accessedValue) {
			return state
		} else {
			throw {
				field: constraints.field,
				messageMaker: (field: string) => `Field "${field}" must be "${accessedValue}".`
			}
		}
	} else {
		throw makeDeveloperError(constraints.field)
	}
}
