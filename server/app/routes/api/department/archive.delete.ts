import { FieldRulesMaker } from "!/types/hybrid"
import { FieldRules } from "!/types/independent"
import { AuthenticatedRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import NoContentResponseInfo from "!/response_infos/no_content"
import JSONController from "!/common_controllers/json_controller"

import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

import array from "!/app/validators/base/array"
import object from "!/app/validators/base/object"
import string from "!/app/validators/base/string"
import integer from "!/app/validators/base/integer"
import same from "!/app/validators/comparison/same"
import exists from "!/app/validators/manager/exists"
import required from "!/app/validators/base/required"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE
		])
	}

	get bodyValidationRules(): object {
		return {
			"data": [ "required", "array" ],
			"data.*": [ "required", "object" ],
			"data.*.type": [ "required", "string", "equals:department" ],
			"data.*.id": [ "required", "numeric", [ "exists", DepartmentManager, "id" ] ]
		}
	}

	makeBodyRuleGenerator(): FieldRulesMaker {
		return (request: AuthenticatedRequest): FieldRules => ({
			data: {
				pipes: [ required, array ],
				constraints: {
					array: {
						rules: {
							pipes: [ required, object ],
							constraints: {
								object: {
									type: {
										pipes: [ required, string, same ],
										constraints: {
											same: "department"
										}
									},
									id: {
										pipes: [ required, integer, exists ],
										constraints: {
											manager: {
												className: DepartmentManager,
												columnName: "id"
											}
										}
									}
								}
							}
						},
						minimum: 1
					}
				}
			}
		})
	}

	async handle(request: AuthenticatedRequest, response: Response): Promise<NoContentResponseInfo> {
		const manager = new DepartmentManager()

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}
}
