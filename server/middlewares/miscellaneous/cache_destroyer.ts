import type { Request, Response, NextFunction } from "!/types/dependent"
import Middleware from "!/bases/middleware"

export default class CacheDestroyer extends Middleware {
	async intermediate(request: Request, _response: Response, next: NextFunction): Promise<void> {
		request.cache.destroy()
		next()
	}
}
