import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import JSONController from "!/controllers/json"
import NoContentResponseInfo from "!/response_infos/no_content"
import CommentManager from "%/managers/comment"

import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import archived from "!/validators/manager/archived"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return makeResourceIdentifierListDocumentRules(
			"comment",
			archived,
			CommentManager
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new CommentManager(request)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.restoreBatch(IDs)

		return new NoContentResponseInfo()
	}
}
