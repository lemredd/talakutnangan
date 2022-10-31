import cors from "cors"
import type { Request, Response, NextFunction } from "!/types/dependent"

import UrlMaker from "$!/singletons/url_maker"
import RequestFilter from "!/bases/request_filter"

const ALLOWED_LIST = [
	UrlMaker.makeBaseURL(),
	process.env.AGORA_TOKEN_SERVICE as string
]

export default class CORS extends RequestFilter {
	private static handler = cors({ "origin": ALLOWED_LIST })

	intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		// @ts-ignore
		CORS.handler(request, response, next)
		return Promise.resolve()
	}

	filterRequest(unusedRequest: Request): Promise<void> {
		/*
		 * Since intermediate method was overrided, just return a resolve promise to follow
		 * base class' requirements.
		 */
		return Promise.resolve()
	}
}
