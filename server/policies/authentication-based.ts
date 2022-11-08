import type { Serializable } from "$/types/general"
import type { AuthenticationOptions } from "!/types/independent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { Request, AuthenticatedIDRequest } from "!/types/dependent"

import { HOME } from "$/constants/template_page_paths"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import URLMaker from "$!/singletons/url_maker"
import deserialize from "$/object/deserialize"
import AuthorizationError from "$!/errors/authorization"

/**
 * Creates middleware to only allow guest or known users only depending on argument.
 *
 * It is the basis of most other policies.
 */
export default class extends Policy {
	private targetAuthenticationState: boolean
	private requireChangedPassword: boolean

	/**
	 * @param targetAuthenticationState Pass true if page only accepts authenticated users. False if
	 * guest only.
	 */
	constructor(targetAuthenticationState: boolean, {
		requireChangedPassword = true
	}: Partial<AuthenticationOptions> = {}) {
		super()
		this.targetAuthenticationState = targetAuthenticationState
		this.requireChangedPassword = requireChangedPassword
	}

	authorize(request: Request | AuthenticatedIDRequest): Promise<void> {
		Log.trace("middleware", `Authorizing in ${request.url}`)

		if (request.isAuthenticated() !== this.targetAuthenticationState) {
			const reason = this.targetAuthenticationState
				? "The user must be logged in to invoke the action."
				: "The user must be logged out to invoke the action."

			const link = this.targetAuthenticationState
				? URLMaker.makeURLFromPath("/user/log_in")
				: URLMaker.makeURLFromPath("/")

			return Promise.reject(new AuthorizationError(reason, link))
		}

		if (request.isAuthenticated() && this.requireChangedPassword) {
			const userProfile = deserialize(request.user as Serializable) as DeserializedUserProfile
			const { hasDefaultPassword = false } = userProfile.meta

			if (hasDefaultPassword) {
				const reason = "The user must have no default password."
				const link = URLMaker.makeURLFromPath(HOME)

				return Promise.reject(new AuthorizationError(reason, link))
			}
		}

		return Promise.resolve()
	}
}
