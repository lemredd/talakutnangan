import compression from "compression"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware";

export default class Compression extends Middleware {
	private static compress = compression()

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		// @ts-ignore
		Compression.compress(request, response, next)
	}
}
