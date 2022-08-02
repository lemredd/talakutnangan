import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import NoContentResponseInfo from "!/response_infos/no_content"
import BoundJSONController from "!/common_controllers/bound_json_controller"

import { UPDATE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import required from "!/validators/base/required"
import object from "!/validators/base/object"
import same from "!/validators/comparison/same"
import string from "!/validators/base/string"
import integer from "!/validators/base/integer"
import length from "!/validators/comparison/length"
import regex from "!/validators/comparison/regex"
import unique from "!/validators/manager/unique"
import acronym from "!/validators/comparison/acronym"
import boolean from "!/validators/base/boolean"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	makeBodyRuleGenerator(request: Request): FieldRules {
		return {
			data: {
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
							pipes: [ required, integer ],
							constraints: {}
						},
						attributes: {
							pipes: [ required, object ],
							constraints: {
								object: {
									fullName: {
										pipes: [ required, string, length, regex, unique ],
										constraints: {
											length: { minimum: 10, maximum: 255 },
											regex: { match: /([A-Z][a-zA-Z]+ )+[A-Z][a-zA-Z]+$/ },
											manager: { className: DepartmentManager, columnName: "fullName" },
											unique: { IDPath: "data.id" }
										}
									},
									acronym: {
										pipes: [ required, string, length, regex, acronym, unique ],
										constraints: {
											length: { minimum: 2, maximum: 255 },
											regex: { match: /([A-Z][a-z]*)+/ },
											acronym: { spelledOutPath: "data.attributes.fullName" },
											manager: { className: DepartmentManager , columnName: "acronym" },
											unique: { IDPath: "data.id" }
										}
									},
									mayAdmit: {
										pipes: [ required, boolean ],
										constraints: {}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	get manager(): BaseManagerClass { return DepartmentManager }

	async handle(request: Request, response: Response): Promise<NoContentResponseInfo> {
		const manager = new DepartmentManager(request.transaction, request.cache)
		const id = +request.params.id
		const affectedCount = await manager.update(id, request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
