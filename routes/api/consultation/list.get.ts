import type { FieldRules } from "!/types/validation"
import type { Request } from "!/types/dependent"
import type { ConsultationQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Manager from "%/managers/consultation"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import date from "!/validators/base/date"
import object from "!/validators/base/object"
import makeListRules from "!/rule_sets/make_list"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import skipAsterisk from "!/validators/comparison/skip_asterisk"
import makeIDBasedFilterRules from "!/rule_sets/make_id-based_filter"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	makeQueryRuleGenerator(): FieldRules {
		return makeListRules(
			Manager,
			{
				...makeIDBasedFilterRules("user", UserManager, { "mustCast": true }),
				"consultationScheduleRange": {
					"constraints": {
						"nullable": {
							"defaultValue": "*"
						},
						"object": {
							"begin": {
								"pipes": [ required, date ]
							},
							"end": {
								// TODO: Ensure this is greater than the start
								"pipes": [ required, date ]
							}
						}
					},
					"pipes": [ nullable, skipAsterisk, object ]
				}
			}
		)
	}

	async handle(request: Request): Promise<ListResponse> {
		const constraints = { ...request.query } as ConsultationQueryParameters<number>

		const manager = new Manager(request)
		const consultations = await manager.list(constraints)

		return new ListResponse(consultations)
	}
}
