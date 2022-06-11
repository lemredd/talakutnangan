import { Request, Response, NextFunction } from "!/types/dependent"

import Policy from "!/bases/policy"
import ControllerLike from "!/bases/controller-like"

export default abstract class extends ControllerLike {
	/**
	 * Returns the policy that will enhance a certain page route. It is treated as the main
	 * handler.
	 */
	abstract get policy(): Policy

	get endHandler(): null { return null }

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		return this.policy.intermediate(request, response, next)
	}
}
