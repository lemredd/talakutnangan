import type { Request } from "!/types/dependent"
import type { ValidationState, ValidationConstraints } from "!/types/validation"
import type { DepartmentIdentifierListDocument } from "$/types/documents/department"

import Manager from "%/managers/department"

/**
 * Validator to check if department still has user.
 *
 * Note: The validator only works for resources with numerical department IDs only.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	const manager = new Manager(constraints.request)

	const modelID = state.value
	const departments = await manager.countUsers([ modelID ]) as DepartmentIdentifierListDocument
	const hasNoUser = departments.data[0].meta.userCount === 0

	if (hasNoUser) return state

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			value: string
		) => {
			const subject = `The "${field}" with a value of "${value}"`
			const predicate = "should have no existing user."

			return `${subject} ${predicate}`
		}
	}

	throw error
}
