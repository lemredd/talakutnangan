import { generatePdf } from "html-pdf-node-ts"

import { OptionalMiddleware } from "!/types/independent"
import type { AsynchronousRequest, Response, BaseManagerClass } from "!/types/dependent"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import Manager from "%/managers/consultation"
import URLMaker from "$!/singletons/url_maker"
import BoundController from "!/controllers/bound"
import Merger from "!/middlewares/miscellaneous/merger"
import AcceptedResponseInfo from "!/response_infos/accepted"

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

	async handle(request: AsynchronousRequest, unusedResponse: Response): Promise<void> {
		const { id } = request.params

		const URL = URLMaker.makeURLFromPath("consultation/:id", { id })
		Log.trace("controller", `converting "${URL}" to PDF`)
		await request.asynchronousOperation.incrementProgress()

		const document = await generatePdf({
			"url": URL
		})
		await request.asynchronousOperation.incrementProgress({
			"fileContents": document
		})
	}

	get postJobs(): OptionalMiddleware[] {
		return [
			CommonMiddlewareList.asynchronousEnder
		]
	}
}
