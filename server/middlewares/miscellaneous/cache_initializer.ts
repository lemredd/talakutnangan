import type { Request } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"
import CacheManager from "$!/singletons/cache_manager"

export default class CacheInitializer extends RequestFilter {
	filterRequest(request: Request): Promise<void> {
		request.cache = CacheManager.initializeClient()

		return Promise.resolve()
	}
}
