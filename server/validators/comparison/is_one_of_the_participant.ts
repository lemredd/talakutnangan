import type { AuthenticatedRequest } from "!/types/dependent"
import { UserDocument, UserResourceIdentifier } from "$/types/documents/user"
import type { ValidationState, ValidationConstraints } from "!/types/validation"

/**
 * Validator to check if requester is of belongs to the participants.
 *
 */

export default async function(
	currentState: Promise<ValidationState>,
	constraints: ValidationConstraints<AuthenticatedRequest>
): Promise<ValidationState> {
	const state = await currentState

	if (state.maySkip) return state

	const participants = state.value as UserResourceIdentifier[]

	const currentUser = constraints.request.user as UserDocument
	const currentUserID = currentUser.data.id
	const isCurrentUserInParticipants = participants.some(
		identifier => identifier.id === currentUserID
	)

	if (isCurrentUserInParticipants) return state

	const error = {
		"field": constraints.field,
		"friendlyName": constraints.friendlyName,
		"messageMaker": (
			field: string,
			unusedValue: string
		) => {
			const subject = `The "${field}" containing participants`
			const predicate = "should have the current user."

			return `${subject} ${predicate}`
		}
	}

	throw error
}
