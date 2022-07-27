import type { FieldRules } from "!/types/independent"
import type { FieldRulesMaker } from "!/types/hybrid"
import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import DepartmentManager from "%/managers/department"
import { READ } from "$/permissions/department_combinations"
import QueryController from "!/common_controllers/query_controller"
import { department as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

import object from "!/app/validators/base/object"
import string from "!/app/validators/base/string"
import nullable from "!/app/validators/base/nullable"
import oneOf from "!/app/validators/comparison/one-of"
import stringArray from "!/app/validators/hybrid/string_array"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		])
	}

	get queryValidationRules(): object {
		// TODO: Validate common query
		return {}
	}

	makeQueryRuleGenerator(): FieldRulesMaker {
		// TODO: make a validator to skip "*" character
		return (request: Request): FieldRules => ({
			filter: {
				pipes: [ nullable, object ],
				constraints: {
					nullable: { defaultValue: {} },
					object: {
						existence: {
							pipes: [ nullable, string, oneOf ],
							constraints: {
								nullable: { defaultValue: "*" },
								oneOf: { values: [ "*", "exists", "archived" ] }
							}
						}
					}
				}
			},
			sort: {
				pipes: [ nullable, stringArray ],
				constraints: {
					nullable: { defaultValue: "id" },
					array: {
						rules: {
							pipes: [ string, oneOf ],
							constraints: {
								oneOf: {
									values: new DepartmentManager().sortableColumns
								}
							}
						}
					}
				}
			}
		})
	}

	async handle(request: Request, response: Response): Promise<void> {
		// TODO: Add limit to the constraints
		const constraints = { ...request.query }

		const manager = new DepartmentManager()
		const departments = await manager.list(constraints)

		response.status(this.status.OK).json(departments)
	}
}
