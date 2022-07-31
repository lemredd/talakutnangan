import type { FieldRules } from "!/types/independent"
import type { FieldRulesMaker } from "!/types/hybrid"
import type { Request, Response } from "!/types/dependent"
import type { RoleResourceIdentifier } from "$/types/documents/role"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import ListResponse from "!/response_infos/list"
import JSONController from "!/common_controllers/json_controller"

import { READ } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

import length from "!/app/validators/comparison/length"
import same from "!/app/validators/comparison/same"
import array from "!/app/validators/base/array"
import object from "!/app/validators/base/object"
import string from "!/app/validators/base/string"
import integer from "!/app/validators/base/integer"
import exists from "!/app/validators/manager/exists"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	get bodyValidationRules(): object {
		return {}
	}

	makeBodyRuleGenerator(): FieldRulesMaker {
		return (request: Request): FieldRules => ({
			data: {
				pipes: [ array, length ],
				constraints: {
					array: {
						rules: {
							pipes: [ object ],
							constraints: {
								object: {
									type: {
										pipes: [ string, same ],
										constraints: {
											same: "role"
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
						}
					},
					length: {
						minimum: 1
					}
				}
			}
		})
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