import type {
	Response,
	NextFunction,
	BaseManagerClass,
	AsynchronousRequest
} from "!/types/dependent"

import Middleware from "!/bases/middleware"
import OkResponseInfo from "!/response_infos/ok"
import StillProcessingError from "$!/errors/still_processing"
import AsynchronousOperationManager from "!/singletons/asynchronous_operation_manager"

export default class AsynchronousOperationInitializer extends Middleware {
	private managerClass: BaseManagerClass
	private totalStepCount: number

	constructor(managerClass: BaseManagerClass, totalStepCount: number) {
		super()
		this.managerClass = managerClass
		this.totalStepCount = totalStepCount
	}

	async intermediate(request: AsynchronousRequest, response: Response, next: NextFunction)
	: Promise<void> {
		request.asynchronousOperation = new AsynchronousOperationManager()

		const document = await request.asynchronousOperation.initializeWithRequest(
			request,
			this.managerClass,
			this.totalStepCount
		)

		if (request.asynchronousOperation.isNew) {
			const responseInfo = new OkResponseInfo(document)
			responseInfo.sendThrough(response)
			next()
		} else if (request.method === "GET") {
			const responseInfo = new OkResponseInfo(document)
			responseInfo.sendThrough(response)
		} else {
			next(new StillProcessingError())
		}
	}
}
