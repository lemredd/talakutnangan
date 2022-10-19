import type { FieldRules } from "!/types/validation"
import type { Request } from "!/types/dependent"
import type { TimeSumQueryParameters } from "$/types/query"

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
import isGreaterThan from "!/validators/comparison/is_greater_than"
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
				...makeIDBasedFilterRules("user", UserManager, {
					"maySkip": false,
					"mustCast": true
				}),
				"dateTimeRange": {
					"constraints": {
						"object": {
							"begin": {
								"pipes": [ required, date ]
							},
							"end": {
								"constraints": {
									"isGreaterThan": {
										"pointer": "filter.dateTimeRange.begin"
									}
								},
								"pipes": [ required, date, isGreaterThan ]
							}
						}
					},
					"pipes": [ required, object ]
				}
			}
		)
	}

	async handle(request: Request): Promise<ListResponse> {
		const constraints = { ...request.query } as TimeSumQueryParameters<number>

		const manager = new Manager(request)
		const timeSums = await manager.sumTimePerWeek(constraints)

		return new ListResponse(timeSums)
	}
}
