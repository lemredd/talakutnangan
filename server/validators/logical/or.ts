import type { ErrorPointer } from "!/types/independent"
import type {
	ValidationState,
	ValidationConstraints,
	OrRuleConstraints
} from "!/types/validation"

import validate from "!/validators/validate"
import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to simulate logical `or` using the validation of sub-rules.
 *
 * If sub-rules return an error, this validator will go through remaining sub-rules. If
 * the last sub-rule return a, all errors will be outputted.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints & Partial<OrRuleConstraints>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	if (isUndefined(constraints.or)) {
		throw makeDeveloperError(constraints.field)
	}

	const clonedState = { ...state }
	let promises = Promise.resolve(clonedState)
	const lastError: ErrorPointer[] = []

	for (const subrules of constraints.or.rules) {
		promises = promises.then(async localState => {
			try {
				const value = await validate(
					{
						[constraints.field]: {
							...subrules,
							"friendlyName": constraints.friendlyName
						}
					},
					constraints.request,
					{ [constraints.field]: localState.value },
					constraints.source
				)

				return {
					"maySkip": true,
					"value": value[constraints.field]
				} as ValidationState
			} catch (errors) {
				lastError.push(...errors as ErrorPointer[])

				return localState
			}
		})
	}

	const resultState = await promises

	if (resultState.maySkip) {
		return state
	}

	throw lastError[0]
}
