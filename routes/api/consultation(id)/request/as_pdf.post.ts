import { generatePdf } from "html-pdf-node-ts"

import type { FieldRules } from "!/types/validation"
import type { OptionalMiddleware } from "!/types/independent"
import type { AsynchronousRequest, Request, Response, BaseManagerClass } from "!/types/dependent"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import Manager from "%/managers/consultation"
import URLMaker from "$!/singletons/url_maker"
import Merger from "!/middlewares/miscellaneous/merger"
import BoundJSONController from "!/controllers/bound_json"

import AsynchronousFile from "%/managers/asynchronous_file"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"
import AsynchronousOperationInitializer
	from "!/middlewares/miscellaneous/asynchronous_operation_initializer"

import exists from "!/validators/manager/exists"
import makeResourceIdentifierDocumentRules from "!/rule_sets/make_resource_identifier_document"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			CommonMiddlewareList.consultationParticipantsOnlyPolicy,
			new BelongsToCurrentUserPolicy(this.manager)
		]) as unknown as Policy
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return makeResourceIdentifierDocumentRules(
			"consultation",
			exists,
			Manager
		)
	}

	get postPolicyMiddlewares(): OptionalMiddleware[] {
		const numberOfTotalStepCount = 3
		return [
			new AsynchronousOperationInitializer(
				AsynchronousFile,
				numberOfTotalStepCount
			)
		]
	}

	get manager(): BaseManagerClass { return Manager }

	async handle(request: AsynchronousRequest, unusedResponse: Response): Promise<void> {
		await request.asynchronousOperation.incrementProgress()

		const { id } = request.params

		const URL = URLMaker.makeURLFromPath("consultation/:id", { id })
		Log.trace("controller", `converting "${URL}" to PDF`)
		await request.asynchronousOperation.incrementProgress()

		const document = await generatePdf({
			"url": URL
		})
		await request.asynchronousOperation.finish({
			"fileContents": document
		})
	}

	get postJobs(): OptionalMiddleware[] {
		return [
			CommonMiddlewareList.asynchronousEnder
		]
	}
}
