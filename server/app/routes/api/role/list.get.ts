import type { FieldRules } from "!/types/independent"
import type { FieldRulesMaker } from "!/types/hybrid"
import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import QueryController from "!/common_controllers/query_controller"

import { READ } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

import object from "!/app/validators/base/object"
import boolean from "!/app/validators/base/boolean"
import makeListRules from "!/app/rule_sets/make_list"
import nullable from "!/app/validators/base/nullable"
import string from "!/app/validators/base/string"

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
		return (request: Request): FieldRules => makeListRules(RoleManager, {
			department: {
				pipes: [ nullable, string ],
				constraints: {
					nullable: { defaultValue: "*" }
				}
			}
		}, {
			meta: {
				pipes: [ nullable, object ],
				constraints: {
					nullable: { defaultValue: {} },
					object: {
						countUsers: {
							pipes: [ nullable, boolean ],
							constraints: {
								nullable: { defaultValue: true },
								boolean: {
									loose: true
								}
							}
						}
					}
				}
			}
		})
	}

	async handle(request: Request, response: Response): Promise<void> {
		const constraints = { ...request.query }

		const manager = new RoleManager()
		const roles = await manager.list(constraints)

		response.status(this.status.OK).json(roles)
	}
}
