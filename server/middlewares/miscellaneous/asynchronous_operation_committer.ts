import type { AsynchronousRequest } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"

export default class AsynchronousOperationCommitter extends RequestFilter {
	async filterRequest(request: AsynchronousRequest): Promise<void> {
		await request.asynchronousOperation.destroyConditionally()
	}
}
