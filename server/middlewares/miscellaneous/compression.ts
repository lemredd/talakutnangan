import compression from "compression"
import type { Request } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"

export default class Compression extends RequestFilter {
	private static compress = compression()

	async filterRequest(request: Request): Promise<void> {
		await this.runFilter(Compression.compress, request)
	}
}
