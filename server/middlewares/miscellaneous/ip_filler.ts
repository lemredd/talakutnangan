import requestIP from "request-ip"
import type { Request } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"

export default class IPFiller extends RequestFilter {
	private static filler = requestIP.mw()

	async filterRequest(request: Request): Promise<void> {
		await this.runFilter(IPFiller.filler, request)
	}
}
