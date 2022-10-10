import type { Request, Response, NextFunction } from "!/types/dependent"
import redirect from "!/helpers/redirect"
import Middleware from "!/bases/middleware"
import RequestEnvironment from "$/singletons/request_environment"

export default class ForceRedirector extends Middleware {
	private location: string
	private redirectStatusCode: number

	constructor(
		location: string,
		redirectStatusCode: number = RequestEnvironment.status.MOVED_TEMPORARILY
	) {
		super()
		this.location = location
		this.redirectStatusCode = redirectStatusCode
	}

	intermediate(unusedRequest: Request, response: Response, unusedNext: NextFunction)
	: Promise<void> {
		redirect(response, this.location, this.redirectStatusCode)
		return Promise.resolve()
	}
}
