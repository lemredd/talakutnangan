import type { Request } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"

export default class TransactionCommitter extends RequestFilter {
	async filterRequest(request: Request): Promise<void> {
		await request.transaction?.destroySuccessfully()
	}
}
