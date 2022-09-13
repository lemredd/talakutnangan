import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type {
	ValidationState,
	ValidationConstraints,
	DoesBelongToCurrentUserConstraints
} from "!/types/validation"

import deserialize from "$/object/deserialize"
import present from "!/validators/manager/present"
import isUndefined from "$/type_guards/is_undefined"
import makeDeveloperError from "!/validators/make_developer_error"

/**
 * Validator to check if a resource belongs to a certain user.
 *
 * Note: The validator only works for resources with numerical IDs only.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<AuthenticatedRequest>
		& Partial<DoesBelongToCurrentUserConstraints<any>>
): Promise<ValidationState> {
	const state = await present(currentState, constraints)

	if (state.maySkip) return state

	if (isUndefined(constraints.manager) || isUndefined(constraints.doesBelongToUser)) {
		throw makeDeveloperError(constraints.field)
	}

	const userProfile = deserialize(constraints.request.user) as DeserializedUserProfile
	const manager = new constraints.manager.className(
		constraints.request.transaction,
		constraints.request.cache
	)

	const userID = Number(userProfile.data.id)
	const modelID = Number(state.value)

	if (Number.isNaN(modelID)) {
		const error = {
			"field": constraints.field,
			"friendlyName": constraints.friendlyName,
			"messageMaker": (
				field: string,
				value: string
			) => `The "${field}" with a value of "${value}" should be a numeric ID.`
		}

		throw error
	}

	const doesBelong = await manager.isModelBelongsTo(
		modelID,
		userID,
		manager.modelChainToUser
	)

	if (doesBelong) return state

	const { permissionGroup, anyPermissionCombinationForBypass } = constraints.doesBelongToUser
	const roles = userProfile.data.roles.data
	const isPermitted = permissionGroup.hasOneRoleAllowed(roles, anyPermissionCombinationForBypass)
	if (isPermitted) return state

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			value: string
		) => {
			const subject = `The "${field}" with a value of "${value}"`
			const firstPossibleCondition = "it belongs to current user"
			const secondPossibleCondition = "current user is permitted"
			const predicate = `can only be processed if ${
				firstPossibleCondition
			} or ${secondPossibleCondition}.`

			return `${subject} ${predicate}`
		}

	}

	throw error
}
