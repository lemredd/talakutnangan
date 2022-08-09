import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import NoContentResponseInfo from "!/response_infos/no_content"
import JSONController from "!/controllers/json_controller"

import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import array from "!/validators/base/array"
import object from "!/validators/base/object"
import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import same from "!/validators/comparison/same"
import exists from "!/validators/manager/exists"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE
		])
	}

	makeBodyRuleGenerator(request: Request): FieldRules {
		return {
			data: {
				pipes: [ required, array, length ],
				constraints: {
					array: {
						pipes: [ required, object ],
						constraints: {
							object: {
								type: {
									pipes: [ required, string, same ],
									constraints: {
										same: {
											value: "department"
										}
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
					length: {
						minimum: 1,
						maximum: 24 // This is possible to change in the future
					}
				}
			}
		}
	}

	async handle(request: Request, response: Response): Promise<NoContentResponseInfo> {
		const manager = new DepartmentManager(request.transaction, request.cache)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}
}
