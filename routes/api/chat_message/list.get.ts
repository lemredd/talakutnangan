import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { ChatMessageQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import Manager from "%/managers/chat_message"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"

import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import string from "!/validators/base/string"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import makeListRules from "!/rule_sets/make_list"
import skipAsterisk from "!/validators/comparison/skip_asterisk"
import makeMultiIDBasedFilterRules from "!/rule_sets/make_multi-id-based_filter"
import doesBelongToCurrentUser from "!/validators/manager/does_belong_to_current_user"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(Manager, {
			...makeMultiIDBasedFilterRules(Manager, {
				"initialPipes": [ required ],
				"multipleIDKey": "consultationIDs",
				"mustCast": true,
				"postIDRules": {
					"pipes": [ doesBelongToCurrentUser ]
				}
			}),
			"chatMessageKind": {
				"constraints": {
					"nullable": { "defaultValue": "*" }
				},
				"pipes": [ nullable, skipAsterisk, string ]
			}
		}, {
			"defaultSortColumn": "-createdAt"
		})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query }

		const manager = new Manager(request)
		const chatMessages = await manager.list(constraints as ChatMessageQueryParameters<number>)

		return new ListResponse(chatMessages)
	}
}
