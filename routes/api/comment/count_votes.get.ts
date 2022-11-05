import type { FieldRules } from "!/types/validation"
import type { AuthenticatedRequest, Response } from "!/types/dependent"
import type { IDsFilter } from "$/types/query"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { CommentResourceIdentifier } from "$/types/documents/comment"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Policy from "!/bases/policy"
import Manager from "%/managers/comment"
import deserialize from "$/object/deserialize"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query"

import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/comment_combinations"
import { comment as permissionGroup } from "$/permissions/permission_list"
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
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	makeQueryRuleGenerator(unusedRequest: AuthenticatedRequest): FieldRules {
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

	async handle(request: AuthenticatedRequest, unusedResponse: Response): Promise<ListResponse> {
		const query = request.query as unknown as Pick<IDsFilter<number>, "filter">
		const user = deserialize(request.user) as DeserializedUserDocument
		const manager = new Manager(request)
		const commentWithUserCount = await manager
		.countVotes(Number(user.data.id), query.filter.IDs ?? []) as CommentResourceIdentifier<"read">

		return new ListResponse(commentWithUserCount)
	}
}
