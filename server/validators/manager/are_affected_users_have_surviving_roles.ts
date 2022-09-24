import type { Request } from "!/types/dependent"
import type { RoleResourceIdentifier } from "$/types/documents/role"
import type { ValidationState, ValidationConstraints } from "!/types/validation"

import Manager from "%/managers/role"

/**
 * Validator to check if the roles can be safely deleted.
 *
 * Note: The validator only works for resources with numerical role IDs only.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<Request>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	const manager = new Manager(constraints.request)

	const resourceIdentifiers = state.value as RoleResourceIdentifier[]
	const roleIDs = resourceIdentifiers.map(identifier => Number(identifier.id))
	const canBeDeleted = await manager.canRolesBeDeLeted(roleIDs)

	if (canBeDeleted) return state

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			value: string
		) => {
			const subject = `The "${field}" with a value of "${value}"`
			const predicate = "should has affected users which do not have surviving roles."

			return `${subject} ${predicate}`
		}
	}

	throw error
}
