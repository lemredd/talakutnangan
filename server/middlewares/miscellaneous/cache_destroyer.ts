import type { Request } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"

export default class CacheDestroyer extends RequestFilter {
	filterRequest(request: Request): Promise<void> {
		request.cache.destroy()

		return Promise.resolve()
	}
}
