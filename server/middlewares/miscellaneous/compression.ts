import compression from "compression"
import type { Request, Response, NextFunction } from "express"

import Middleware from "!/bases/middleware";

export default class Compression extends Middleware {
	private static compress = compression()

	intermediate(request: Request, response: Response, next: NextFunction): void {
		Compression.compress(request, response, next)
	}
}
