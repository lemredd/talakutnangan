import { FieldRules } from "!/types/validation"
import { Request, Response } from "!/types/dependent"

import JSONController from "!/controllers/json"
import Manager from "%/managers/attached_chat_file"
import NoContentResponseInfo from "!/response_infos/no_content"

import Policy from "!/bases/policy"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import exists from "!/validators/manager/exists"
import doesBelongToCurrentUser from "!/validators/manager/does_belong_to_current_user"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return makeResourceIdentifierListDocumentRules("attached_chat_file", exists, Manager, {
			"postIDRules": {
				"pipes": [ doesBelongToCurrentUser ]
			}
		})
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new Manager(request)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}
}
