import type { Request, AuthenticatedIDRequest } from "!/types/dependent"

import Policy from "!/bases/policy"
import URLMaker from "$!/singletons/url_maker"
import AuthorizationError from "$!/errors/authorization"

/**
 * Creates middleware to only allow guest or known users only depending on argument.
 *
 * It is the basis of most other policies.
 */
export default class extends Policy {
	private targetAuthenticationState: boolean

	/**
	 * @param targetAuthenticationState Pass true if page only accepts authenticated users. False if
	 * guest only.
	 */
	constructor(targetAuthenticationState: boolean) {
		super()
		this.targetAuthenticationState = targetAuthenticationState
	}

	async authorize(request: Request | AuthenticatedIDRequest): Promise<void> {
		if (request.isAuthenticated() !== this.targetAuthenticationState) {
			const reason = this.targetAuthenticationState
				? "The user must be logged in to invoke the action."
				: "The user must be logged out to invoke the action."

			const link = this.targetAuthenticationState
				? URLMaker.makeURLFromPath("/log_in")
				: URLMaker.makeURLFromPath("/")

			throw new AuthorizationError(reason, link)
		}
	}
}
