import type { UserKind } from "$/types/database"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import deserialize from "$/object/deserialize"
import AuthorizationError from "$!/errors/authorization"
import AuthenticationBasedPolicy from "!/policies/authentication-based"

/**
 * Creates middleware to only allow certain kinds of user.
 *
 * Automatically requires user to be authenticated.
 */
export default class extends AuthenticationBasedPolicy {
	private kinds: UserKind[]

	/**
	 * @param kinds Specific kinds of user to only allow.
	 */
	constructor(...kinds: UserKind[]) {
		super(true)
		this.kinds = kinds
	}

	async authorize(request: AuthenticatedRequest): Promise<void> {
		await super.authorize(request)

		const user = deserialize(request.user) as DeserializedUserProfile
		const { kind } = user.data

		if (!this.kinds.includes(kind)) {
			throw new AuthorizationError("Correct user kind can invoke the action.")
		}
	}
}
