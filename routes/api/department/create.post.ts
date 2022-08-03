import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import CreatedResponseInfo from "!/response_infos/created"
import JSONController from "!/controllers/json_controller"

import { CREATE } from "$/permissions/department_combinations"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import same from "!/validators/comparison/same"
import boolean from "!/validators/base/boolean"
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"
import notExists from "!/validators/manager/not_exists"
import acronym from "!/validators/comparison/acronym"


export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
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
						attributes: {
							pipes: [ required, object ],
							constraints: {
								object: {
									fullName: {
										pipes: [ required, string, length, regex, notExists ],
										constraints: {
											length: { minimum: 10, maximum: 255 },
											regex: { match: /([A-Z][a-zA-Z]+ )+[A-Z][a-zA-Z]+$/ },
											manager: { className: DepartmentManager , columnName: "fullName" }
										}
									},
									acronym: {
										pipes: [ required, string, length, regex, acronym, notExists ],
										constraints: {
											length: { minimum: 2, maximum: 255 },
											regex: { match: /([A-Z][a-z]*)+/ },
											acronym: { spelledOutPath: "data.attributes.fullName" },
											manager: { className: DepartmentManager , columnName: "fullName" }
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

	async handle(request: Request, response: Response): Promise<CreatedResponseInfo> {
		const manager = new DepartmentManager(request.transaction, request.cache)
		const departmentInfo = await manager.create(request.body.data.attributes)

		return new CreatedResponseInfo(departmentInfo)
	}
}