import type { AsynchronousRequest, BaseManagerClass } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"
import AsynchronousOperationManager from "!/singletons/asynchronous_operation_manager"

export default class AsynchronousOperationInitializer extends RequestFilter {
	private managerClass: BaseManagerClass
	private totalStepCount: number

	constructor(managerClass: BaseManagerClass, totalStepCount: number) {
		super()
		this.managerClass = managerClass
		this.totalStepCount = totalStepCount
	}

	async filterRequest(request: AsynchronousRequest): Promise<void> {
		request.asynchronousOperation = new AsynchronousOperationManager()

		await request.asynchronousOperation.initializeWithRequest(
			request,
			this.managerClass,
			this.totalStepCount
		)
	}
}
