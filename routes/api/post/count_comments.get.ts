import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { IDOnlyQueryParameters } from "$/types/query"
import type { DepartmentResourceIdentifier } from "$/types/documents/department"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Policy from "!/bases/policy"
import ListResponse from "!/response_infos/list"
import Manager from "%/managers/department"
import QueryController from "!/controllers/query"

import { READ } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import object from "!/validators/base/object"
import makeIDRules from "!/rule_sets/make_id"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import nullable from "!/validators/base/nullable"
import length from "!/validators/comparison/length"
import stringArray from "!/validators/hybrid/string_array"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(unusedRequest: Request): FieldRules {
		return {
			"filter": {
				"constraints": {
					"nullable": { "defaultValue": {} },
					"object": {
						"IDs": {
							"constraints": {
								"array": makeIDRules({
									"IDName": "id",
									"mustCast": true,
									"postRules": {
										"constraints": {
											"manager": {
												"className": Manager,
												"columnName": "id"
											}
										},
										"pipes": [ exists ]
									}
								}).id,
								"length": {
									"maximum": Number(process.env.DATABASE_MAX_SELECT || DEFAULT_LIST_LIMIT),
									"minimum": 1
								}
							},
							"pipes": [ required, stringArray, length ]
						}
					}
				},
				"pipes": [ nullable, object ]
			}
		}
	}

	async handle(request: Request, unusedResponse: Response): Promise<ListResponse> {
		const query = request.query as unknown as IDOnlyQueryParameters<number>

		const manager = new Manager(request)
		const departmentWithUserCount = await manager
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		.countUsers(query.filter.IDs as number[]) as DepartmentResourceIdentifier<"read">

		return new ListResponse(departmentWithUserCount)
	}
}
