import type { FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Policy from "!/bases/policy"
import deserialize from "$/object/deserialize"
import JSONController from "!/controllers/json"
import Manager from "%/managers/chat_message_activity"
import ConsultationManager from "%/managers/consultation"
import NoContentResponseInfo from "!/response_infos/no_content"

import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import exists from "!/validators/manager/exists"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedRequest): FieldRules {
		return makeResourceIdentifierListDocumentRules(
			"chat_message_activity",
			exists,
			Manager
		)
	}

	async handle(
		request: AuthenticatedRequest,
		unusedResponse: Response
	): Promise<NoContentResponseInfo> {
		const manager = new Manager(request)
		const user = deserialize(request.user) as DeserializedUserProfile

		const consultationIDs = <number[]>[]
		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		if (user.data.kind === "reachable_employee") {
			consultationIDs.push(...await manager.retrieveExistingConsultationIDs(IDs))
		}
		await manager.archiveBatch(IDs)

		const consultationManager = new ConsultationManager()
		if (consultationIDs.length > 0) {
			consultationManager.archiveBatch(consultationIDs)
		}

		return new NoContentResponseInfo()
	}
}
