import { AuthenticatedRequest,  Request, Response } from "!/types/dependent"
import type { BaseManagerClass } from "!/types/independent"
import { FieldRules } from "!/types/validation"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import { UPDATE } from "$/permissions/department_combinations"
import NoContentResponseInfo from "!/response_infos/no_content"
import BoundJSONController from "!/common_controllers/bound_json_controller"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"
import { FieldRulesMaker } from "!/types/hybrid"
import required from "!/app/validators/base/required"
import object from "!/app/validators/base/object"
import same from "!/app/validators/comparison/same"
import string from "!/app/validators/base/string"
import integer from "!/app/validators/base/integer"
import length from "!/app/validators/comparison/length"
import regex from "!/app/validators/comparison/regex"
import unique from "!/app/validators/manager/unique"
import acronym from "!/app/validators/comparison/acronym"
import boolean from "!/app/validators/base/boolean"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}

	get bodyValidationRules(): object {
		return {
			"data": [ "required", "object" ],
			"data.type": [ "required", "string", "equals:department" ],
			"data.id": [ "required", "numeric" ],
			"data.attributes": [ "required", "object" ],
			"data.attributes.fullName": [
				"required",
				"string",
				"minLength:10",
				"regex:([A-Z][a-zA-Z]+ )+[A-Z][a-zA-Z]+$",
				[ "unique", DepartmentManager, "fullName", "data.id" ]
			],
			"data.attributes.acronym": [
				"required",
				"string",
				"minLength:2",
				"regex:([A-Z][a-z]*)+",
				"acronym:data.attributes.fullName",
				[ "unique", DepartmentManager, "acronym", "data.id" ]
			],
			"data.attributes.mayAdmit": [ "required", "boolean" ]
		}
	}

	makeBodyRuleGenerator(): FieldRulesMaker {
		return (request: AuthenticatedRequest): FieldRules => ({
			data: {
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
											manager: { className: DepartmentManager, columnName: "fulName" },
											unique: { IDPath: "data.id" }
										}
									},
									acronym: {
										pipes: [ required, string, length, regex, acronym, unique ],
										constraints: {
											length: { minimum: 2, maximum: 255 },
											regex: { match: /([A-Z][a-z]*)+/ },
											acronym: { spelledOutPath: "data.attributes.fullName" },
											manager: { className: DepartmentManager , columnName: "fullName" },
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
		})
	}

	get manager(): BaseManagerClass { return DepartmentManager }

	async handle(request: Request, response: Response): Promise<NoContentResponseInfo> {
		const manager = new DepartmentManager(request.transaction, request.cache)
		const id = +request.params.id
		const affectedCount = await manager.update(id, request.body.data.attributes)

		return new NoContentResponseInfo()
	}
}
