import type { OptionalMiddleware } from "!/types/independent"
import type {
	AsynchronousRequest,
	Response,
	NextFunction,
	BaseManagerClass
} from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/consultation"
import BoundController from "!/controllers/bound"
import Merger from "!/middlewares/miscellaneous/merger"

import AsynchronousFile from "%/managers/asynchronous_file"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"
import AsynchronousOperationInitializer
	from "!/middlewares/miscellaneous/asynchronous_operation_initializer"

export default class extends BoundController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			CommonMiddlewareList.consultationParticipantsOnlyPolicy,
			new BelongsToCurrentUserPolicy(this.manager)
		]) as unknown as Policy
	}

	get postPolicyMiddlewares(): OptionalMiddleware[] {
		const numberOfTotalStepCount = 2
		return [
			new AsynchronousOperationInitializer(
				AsynchronousFile,
				numberOfTotalStepCount
			)
		]
	}

	get manager(): BaseManagerClass { return Manager }

	async intermediate(request: AsynchronousRequest, response: Response, next: NextFunction)
	: Promise<void> {
		await this.handle(request, response)
		next()
	}

	handle(unusedRequest: AsynchronousRequest, unusedResponse: Response): Promise<void> {
		return Promise.resolve()
	}

	get postJobs(): OptionalMiddleware[] {
		return [
			CommonMiddlewareList.asynchronousEnder
		]
	}
}
