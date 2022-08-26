import { Request } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"

/**
 * Base class for policies.
 *
 * Policies are expected to throw error if the user is not authorized.
 */
export default abstract class extends RequestFilter {
	abstract authorize(request: Request): Promise<void>

	async filterRequest(request: Request): Promise<void> {
		await this.authorize(request)
	}
}
