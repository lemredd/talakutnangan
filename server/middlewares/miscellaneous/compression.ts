import compression from "compression"
import type { Request, Response, NextFunction, RequestHandler } from "express"

import Middleware from "!/routes/bases/middleware";

export default class extends Middleware {
	intermediate(request: Request, response: Response, next: NextFunction): void {}

	generateHandlers(): RequestHandler[] {
		return [
			compression()
		]
	}
}
