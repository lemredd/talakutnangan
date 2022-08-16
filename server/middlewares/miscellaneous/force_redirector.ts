import type { Request, Response, NextFunction } from "!/types/dependent"
import Middleware from "!/bases/middleware"
import RequestEnvironment from "$/helpers/request_environment"

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

	intermediate(request: Request, response: Response, unusedNext: NextFunction): Promise<void> {
		response.writeHead(this.redirectStatusCode, {
			"Location": this.location
		})
		response.end()
		return Promise.resolve()
	}
}
