import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { ChatMessageQueryParameters } from "$/types/query"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Policy from "!/bases/policy"
import Manager from "%/managers/chat_message"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"
import ConsultationManager from "%/managers/consultation"

import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import boolean from "!/validators/base/boolean"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import makeListRules from "!/rule_sets/make_list"
import length from "!/validators/comparison/length"
import stringArray from "!/validators/hybrid/string_array"
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
			...makeMultiIDBasedFilterRules(ConsultationManager, {
				"initialPipes": [ required ],
				"multipleIDKey": "consultationIDs",
				"mustCast": true,
				"postIDRules": {
					"pipes": [ doesBelongToCurrentUser ]
				}
			}),
			"chatMessageKind": {
				"constraints": {
					"length": {
						"maximum": DEFAULT_LIST_LIMIT,
						"minimum": 1
					},
					"nullable": { "defaultValue": "*" }
				},
				"pipes": [ nullable, skipAsterisk, stringArray, length ]
			},
			"previewMessageOnly": {
				"constraints": {
					"boolean": {
						"loose": true
					},
					"nullable": { "defaultValue": "false" }
				},
				"pipes": [ nullable, skipAsterisk, boolean ]
			}
		}, {
			"defaultSortColumn": "-createdAt"
		})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query } as ChatMessageQueryParameters<number>

		const manager = new Manager(request)

		if (constraints.filter.previewMessageOnly) {
			const chatMessages = await manager.findPreviews(
				constraints.filter.consultationIDs as number[]
			)

			return new ListResponse(chatMessages)
		}

		const chatMessages = await manager.list(constraints)

		return new ListResponse(chatMessages)
	}
}
