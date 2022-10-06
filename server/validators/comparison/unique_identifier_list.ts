import { ResourceIdentifier } from "$/types/documents/base"
import type { Request } from "!/types/dependent"
import type { ValidationState, ValidationConstraints } from "!/types/validation"
import makeUnique from "$/array/make_unique"

/**
 * Validator to check if ID's in identifer list are unique.
 *
 */

export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	const list = state.value as ResourceIdentifier[]
	const originalList = list.map(resource => resource.id)
	const originalLength = originalList.length
	const uniqueList = makeUnique(list)
	const uniqueLength = uniqueList.length

	if (originalLength === uniqueLength) return state

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			unusedValue: string
		) => {
			const subject = `The "${field}" list identifiers`
			const predicate = "should be unique."

			return `${subject} ${predicate}`
		}
	}

	throw error
}
