import Policy from "!/bases/policy"
import type { Request } from "!/types/dependent"

/**
 * Creates middleware to only allow guest users only.
 *
 * Useful for home page and some authentication forms.
 */
export default class extends Policy {
	mayAllow(request: Request): boolean {
		return !request.isAuthenticated()
	}
}
