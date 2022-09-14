import type { FieldRules } from "!/types/validation"
import type { RoleQueryParameters } from "$/types/query"
import type { Request, Response } from "!/types/dependent"
import type { RoleResourceIdentifier } from "$/types/documents/role"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"

import { READ } from "$/permissions/role_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { role as permissionGroup } from "$/permissions/permission_list"

import object from "!/validators/base/object"
import makeIDRules from "!/rule_sets/make_id"
import exists from "!/validators/manager/exists"
import nullable from "!/validators/base/nullable"
import required from "!/validators/base/required"
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
												"className": RoleManager,
												"columnName": "id"
											}
										},
										"pipes": [ exists ]
									}
								}).id,
								"length": {
									"maximum": Number(process.env.DATABASE_MAX_SELECT || "10"),
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
		const query = request.query as unknown as Pick<RoleQueryParameters<number>, "filter">

		const manager = new RoleManager(request)
		const rolesWithUserCount = await manager
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		.countUsers(query.filter.IDs!) as RoleResourceIdentifier

		return new ListResponse(rolesWithUserCount)
	}
}
