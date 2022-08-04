import type { Request, Response, NextFunction } from "!/types/dependent"
import CacheManager from "$!/singletons/cache_manager"
import Middleware from "!/bases/middleware"

export default class CacheInitializer extends Middleware {
	async intermediate(request: Request, _response: Response, next: NextFunction): Promise<void> {
		request.cache = CacheManager.initializeClient()

		next()
	}
}
