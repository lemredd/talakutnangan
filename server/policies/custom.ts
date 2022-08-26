import type { Request } from "!/types/dependent"

import Policy from "!/bases/policy"

/**
 * Creates middleware to allows the user if the custom policy function.
 *
 * Used for resource under a permission not explicit made for them. It is recommended to be used
 * with other policies.
 */
export default class <T extends Request = Request> extends Policy {
	private check: (request: T) => Promise<void>

	/**
	 * @param check A callback to check if the user is authorized.
	 */
	constructor(check: (request: T) => Promise<void>) {
		super()
		this.check = check
	}

	async authorize(request: T): Promise<void> {
		await this.check(request)
	}
}
