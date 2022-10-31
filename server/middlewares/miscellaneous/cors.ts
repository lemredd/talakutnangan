import cors from "cors"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"

const ALLOWED_LIST = [
	"http://localhost:16000"
	// process.env.AGORA_TOKEN_SERVICE as string
]

export default class CORS extends Middleware {
	private static handler = cors({ "origin": process.env.AGORA_TOKEN_SERVICE as string })

	intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		// @ts-ignore
		response.setHeader("Access-Control-Allow-Origin", ALLOWED_LIST.join(","))
		response.setHeader("Cross-Origin-Resource-Policy", "cross-origin")
		response.setHeader("Referrer-Policy", "no-referrer")
		next()
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
