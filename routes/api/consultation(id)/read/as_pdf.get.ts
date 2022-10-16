import type { FieldRules } from "!/types/validation"
import type { Request, Response, BaseManagerClass } from "!/types/dependent"
import type { AsynchronousFileDocument } from "$/types/documents/asynchronous_file"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import Manager from "%/managers/consultation"
import OkResponseInfo from "!/response_infos/ok"
import Merger from "!/middlewares/miscellaneous/merger"
import BoundJSONController from "!/controllers/bound_json"
import AsynchronousFileManager from "%/managers/asynchronous_file"

import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"

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
			"asynchronous_file",
			exists,
			AsynchronousFileManager
		)
	}

	get manager(): BaseManagerClass { return Manager }

	async handle(request: Request, unusedResponse: Response): Promise<OkResponseInfo> {
		const manager = new AsynchronousFileManager(request)
		const { id } = request.params

		const document = await manager.findWithID(
			Number(id),
			{
				"constraints": {
					"filter": {
						"existence": "*"
					}
				},
				"transformerOptions": {
					"raw": true
				}
			}
		) as AsynchronousFileDocument<"read", "raw">

		const file = document.data.attributes.fileContents

		Log.success("controller", "successfully got the consultation")

		return new OkResponseInfo(file as Buffer, "application/pdf")
	}
}
