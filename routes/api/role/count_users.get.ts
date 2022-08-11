import type { FieldRules } from "!/types/validation"
import type { RoleQueryParameters } from "$/types/query"
import type { Request, Response } from "!/types/dependent"
import type { RoleResourceIdentifier } from "$/types/documents/role"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import ListResponse from "!/response_infos/list"
import QueryController from "!/controllers/query_controller"

import { READ } from "$/permissions/role_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { role as permissionGroup } from "$/permissions/permission_list"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import exists from "!/validators/manager/exists"
import nullable from "!/validators/base/nullable"
import required from "!/validators/base/required"
import oneOf from "!/validators/comparison/one-of"
import length from "!/validators/comparison/length"
import stringArray from "!/validators/hybrid/string_array"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeQueryRuleGenerator(request: Request): FieldRules {
		return {
			filter: {
				pipes: [ nullable, object ],
				constraints: {
					nullable: { defaultValue: {} },
					object: {
						IDs: {
							pipes: [ required, stringArray, length ],
							constraints: {
								array: {
									pipes: [ integer, exists ],
									constraints: {
										manager: {
											className: RoleManager,
											columnName: "id"
										}
									}
								},
								length: {
									minimum: 1,
									maximum: +process.env.DATABASE_MAX_SELECT! || 10
								}
							}
						}
					}
				}
			}
		}
	}

	async handle(request: Request, response: Response): Promise<ListResponse> {
		const query = request.query as unknown as Pick<RoleQueryParameters, "filter">

		const manager = new RoleManager(request.transaction, request.cache)
		const rolesWithUserCount = await manager
			.countUsers(query.filter.IDs!) as RoleResourceIdentifier

		return new ListResponse(rolesWithUserCount)
	}
}
