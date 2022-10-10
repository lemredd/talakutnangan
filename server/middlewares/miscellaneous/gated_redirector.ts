import type { Request, Response, NextFunction } from "!/types/dependent"
import redirect from "!/helpers/redirect"
import Middleware from "!/bases/middleware"
import RequestEnvironment from "$/singletons/request_environment"

export default class GatedRedirector<T extends Request = Request> extends Middleware {
	private location: string
	private redirectStatusCode: number
	private redirectGate: (request: T) => Promise<boolean>

	constructor(
		location: string,
		redirectGate: (request: T) => Promise<boolean>,
		redirectStatusCode: number = RequestEnvironment.status.MOVED_TEMPORARILY
	) {
		super()
		this.location = location
		this.redirectGate = redirectGate
		this.redirectStatusCode = redirectStatusCode
	}

	async intermediate(request: T, response: Response, next: NextFunction): Promise<void> {
		if (await this.redirectGate(request)) {
			redirect(response, this.location, this.redirectStatusCode)
		} else {
			next()
		}
	}
}
