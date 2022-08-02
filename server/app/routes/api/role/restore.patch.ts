import type { Request, Response } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import NoContentResponseInfo from "!/response_infos/no_content"
import JSONController from "!/common_controllers/json_controller"
import { ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

import array from "!/app/validators/base/array"
import object from "!/app/validators/base/object"
import string from "!/app/validators/base/string"
import same from "!/app/validators/comparison/same"
import integer from "!/app/validators/base/integer"
import required from "!/app/validators/base/required"
import length from "!/app/validators/comparison/length"
import archived from "!/app/validators/manager/archived"

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
						rules: {
							pipes: [ required, object ],
							constraints: {
								object: {
									type: {
										pipes: [ required, string, same ],
										constraints: {
											same: "role"
										}
									},
									id: {
										pipes: [ required, integer, archived ],
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
						minimum: 1,
						maximum: 24 // This is possible to change in the future
					}
				}
			}
		}
	}

	async handle(request: Request, response: Response): Promise<NoContentResponseInfo> {
		const manager = new RoleManager(request.transaction, request.cache)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.restoreBatch(IDs)

		return new NoContentResponseInfo()
	}
}
