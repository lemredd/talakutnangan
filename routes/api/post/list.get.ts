import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { PostQueryParameters } from "$/types/query"

import Policy from "!/bases/policy"
import Manager from "%/managers/post"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"
import DepartmentManager from "%/managers/department"

import {
	READ_ANYONE_ON_ALL_DEPARTMENTS,
	READ_ANYONE_ON_OWN_DEPARTMENT
} from "$/permissions/post_combinations"

import PermissionBasedPolicy from "!/policies/permission-based"
import makeIDBasedFilterRules from "!/rule_sets/make_id-based_filter"
import { post as permissionGroup } from "$/permissions/permission_list"

import date from "!/validators/base/date"
import object from "!/validators/base/object"
import required from "!/validators/base/required"
import makeListRules from "!/rule_sets/make_list"
import isGreaterThan from "!/validators/comparison/is_greater_than"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_ANYONE_ON_ALL_DEPARTMENTS,
			READ_ANYONE_ON_OWN_DEPARTMENT
		])
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return makeListRules(Manager, {
			...makeIDBasedFilterRules("departmentID", DepartmentManager, {
				"defaultValue": null,
				"mayConsiderEmptyStringAsNull": true,
				"mustCast": true,
				"mustSkipAfterSettingDefault": true
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
		})
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const constraints = { ...request.query } as PostQueryParameters<number>

		const manager = new Manager(request)

		const post = await manager.list(constraints)

		return new ListResponse(post)
	}
}
