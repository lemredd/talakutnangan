import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { RoleResourceIdentifier } from "$/types/documents/role"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import ListResponse from "!/response_infos/list"
import JSONController from "!/controllers/json_controller"

import { READ } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import array from "!/validators/base/array"
import object from "!/validators/base/object"
import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import same from "!/validators/comparison/same"
import exists from "!/validators/manager/exists"
import length from "!/validators/comparison/length"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	makeBodyRuleGenerator(request: Request): FieldRules {
		return {
			data: {
				pipes: [ array, length ],
				constraints: {
					array: {
						pipes: [ object ],
						constraints: {
							object: {
								type: {
									pipes: [ string, same ],
									constraints: {
										same: {
											value: "role"
										}
									}
								},
								id: {
									pipes: [ integer, exists ],
									constraints: {
										manager: {
											className: RoleManager,
											columnName: "id"
										}
									}
								}
							}
						}
					},
					length: {
						minimum: 1
					}
				}
			}
		}
	}

	async handle(request: Request, response: Response): Promise<ListResponse> {
		const IDs = (request.body.data as RoleResourceIdentifier[]).map(object => {
			return object.id
		})

		const manager = new RoleManager(request.transaction, request.cache)
		const rolesWithUserCount = await manager.countUsers(IDs)

		return new ListResponse(rolesWithUserCount)
	}
}
