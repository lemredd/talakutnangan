import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { ValidationState, ValidationConstraints } from "!/types/validation"

import UserManager from "%/managers/user"
import deserialize from "$/helpers/deserialize"

/**
 * Validator to check if the password matches the password of currently logged in user.
 */
export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<AuthenticatedRequest>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	const userProfile = deserialize(constraints.request.user) as DeserializedUserProfile
	const { email } = userProfile.data
	const password = state.value

	const manager = new UserManager(constraints.request.transaction, constraints.request.cache)
	const foundModel = await manager.findWithCredentials(email, password)

	if (foundModel !== null) {
		return state
	}

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			unusedField: string,
			unusedValue: string
		) => "The password does not match the password of currently logged in user."
	}

	throw error
}
