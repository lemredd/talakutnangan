import type { RedirectInfoMaker } from "!/types/hybrid"
import type { Request, Response, NextFunction } from "!/types/dependent"

import redirect from "!/helpers/redirect"
import Middleware from "!/bases/middleware"

export default class DynamicGatedRedirector<T extends Request = Request> extends Middleware {
	private redirectInfoMaker: RedirectInfoMaker<T>

	constructor(redirectInfoMaker: RedirectInfoMaker<T>) {
		super()
		this.redirectInfoMaker = redirectInfoMaker
	}

	async intermediate(request: T, response: Response, next: NextFunction): Promise<void> {
		const redirectInfo = await this.redirectInfoMaker(request)

		if (redirectInfo === null) {
			next()
		} else {
			const {
				location,
				status = this.status.MOVED_TEMPORARILY
			} = redirectInfo
			redirect(response, location, status)
		}
	}
}
