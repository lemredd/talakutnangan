import { EndHandler } from "!/types/hybrid"
import { Request, Response, NextFunction } from "!/types/dependent"

import Log from "$!/singletons/log"
import endRequest from "!/helpers/end_request"
import ResponseInfo from "!/bases/response_info"
import ControllerLike from "!/bases/controller-like"

/**
 * Base class for controllers which accept JSON as their request body.
 */
export default abstract class extends ControllerLike {
	/**
	 * Handles the request mainly.
	 */
	abstract handle(request: Request, response: Response): Promise<ResponseInfo|void>

	get endHandler(): EndHandler { return endRequest }

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		return await this.handle(request, response)
		.then(responseInfo => this.respond(response, responseInfo))
		.then(() => next())
		.catch(next)
	}

	private respond(response: Response, responseInfo: ResponseInfo|void): void {
		if (responseInfo) {
			responseInfo.sendThrough(response)
		} else {
			const routeInfo = this.routeInformation
			if (routeInfo.purpose === "api") {
				const message = `Route "${routeInfo.method} ${URL}" should return a response info`
				Log.errorMessage("controller", message)
			}
		}
	}
}
