import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { DepartmentResourceIdentifier } from "$/types/documents/department"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import ListResponse from "!/response_infos/list"
import JSONController from "!/controllers/json_controller"

import { READ } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
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
						rules: {
							pipes: [ object ],
							constraints: {
								object: {
									type: {
										pipes: [ string, same ],
										constraints: {
											same: {
												value: "department"
											}
										}
									},
									id: {
										pipes: [ integer, exists ],
										constraints: {
											manager: {
												className: DepartmentManager,
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
		}
	}

	async handle(request: Request, response: Response): Promise<ListResponse> {
		const IDs = (request.body.data as DepartmentResourceIdentifier[]).map(object => {
			return object.id
		})

		const manager = new DepartmentManager(request.transaction, request.cache)
		const departmentWithUserCount = await manager.countUsers(IDs)

		return new ListResponse(departmentWithUserCount)
	}
}
