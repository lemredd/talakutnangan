import { PreprocessedRequest, Response } from "!/types/dependent"

import UserFactory from "~/factories/user"
import Middleware from "!/bases/middleware"
import DevController from "!/common_controllers/dev_controller"
import LocalLogInMiddleware from "!/middlewares/authentication/local_log_in"

interface OwnArguments {
	hasPreprocessed?: boolean
}

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: PreprocessedRequest<OwnArguments>, response: Response): Promise<void> {
		if (request.nextMiddlewareArguments?.hasPreprocessed) {
			response.status(this.status.OK).end()
		} else {
			request.nextMiddlewareArguments = { hasPreprocessed: true }
			const user = await (new UserFactory()).insertOne()
		}
	}

	get postJobs(): Middleware[] {
		return [
			new LocalLogInMiddleware(),
			this
		]
	}
}
