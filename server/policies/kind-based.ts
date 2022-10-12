import type { UserKind } from "$/types/database"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { AdvanceAuthenticationOptions } from "!/types/independent"

import deserialize from "$/object/deserialize"
import AuthorizationError from "$!/errors/authorization"
import AuthenticationBasedPolicy from "!/policies/authentication-based"


/**
 * Creates middleware to only allow certain kinds of user.
 *
 * Automatically requires user to be authenticated.
 * @param checkOthers Extra function used for checking other constraints.
 */
export default class <
	V extends AuthenticatedRequest = AuthenticatedRequest
> extends AuthenticationBasedPolicy {
	private kinds: UserKind[]
	private checkOthers: (request: V) => Promise<void>

	/**
	 * @param kinds Specific kinds of user to only allow.
	 */
	constructor(
		kinds: UserKind[],
		{
			checkOthers = (): Promise<void> => {
				const promise = Promise.resolve()
				return promise
			},
			...otherAuthenticationOptions
		}: Partial<AdvanceAuthenticationOptions<V>> = {}
	) {
		super(true, otherAuthenticationOptions)
		this.checkOthers = checkOthers
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
