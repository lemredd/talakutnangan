import type { AuthenticatedIDRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import deserialize from "$/object/deserialize"
import AuthorizationError from "$!/errors/authorization"
import AuthenticationBasedPolicy from "!/policies/authentication-based"

/**
 * Creates a policy to limit the operation to the owner of the resource.
 *
 * Requires that the resource has been validated ID route parameter which is then compared if the
 * current logged in user has the same primary ID.
 */
export default class extends AuthenticationBasedPolicy {
	constructor() {
		super(true)
	}

	async authorize(request: AuthenticatedIDRequest): Promise<void> {
		await super.authorize(request)

		const user = deserialize(request.user) as DeserializedUserProfile
		if (String(user.data.id) !== String(request.params.id)) {
			throw new AuthorizationError("Only the owner of the resource can do the operation.")
		}
	}
}
