import {AuthenticatedRequest, Request, Response } from "!/types/dependent"
import { FieldRules } from "!/types/independent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import CreatedResponseInfo from "!/response_infos/created"
import { CREATE } from "$/permissions/department_combinations"
import JSONController from "!/common_controllers/json_controller"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"
import { FieldRulesMaker } from "!/types/hybrid"
import object from "!/app/validators/base/object"
import required from "!/app/validators/base/required"
import same from "!/app/validators/comparison/same"
import string from "!/app/validators/base/string"
import length from "!/app/validators/comparison/length"
import regex from "!/app/validators/comparison/regex"
import notExists from "!/app/validators/manager/not_exists"
import acronym from "!/app/validators/comparison/acronym"
import boolean from "!/app/validators/base/boolean"


export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
		])
	}

	get bodyValidationRules(): object {
		// TODO: Think of the minimum length of full name.
		return {
			"data": [ "required", "object" ],
			"data.type": [ "required", "string", "equals:department" ],
			"data.attributes": [ "required", "object" ],
			"data.attributes.fullName": [
				"required",
				"string",
				"minLength:10",
				"regex:([A-Z][a-zA-Z]+ )+[A-Z][a-zA-Z]+$",
				[ "notExists", DepartmentManager, "fullName" ]
			],
			"data.attributes.acronym": [
				"required",
				"string",
				"minLength:2",
				"regex:([A-Z][a-z]*)+",
				"acronym:data.attributes.fullName",
				[ "notExists", DepartmentManager, "acronym" ]
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
		})
	}

	async handle(request: Request, response: Response): Promise<CreatedResponseInfo> {
		const manager = new DepartmentManager(request.transaction, request.cache)
		const departmentInfo = await manager.create(request.body.data.attributes)

		return new CreatedResponseInfo(departmentInfo)
	}
}
