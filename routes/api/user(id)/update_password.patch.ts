import type { FieldRules, Rules } from "!/types/validation"
import type { AuthenticatedRequest, Response, BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/user"
import Middleware from "!/bases/middleware"
import DatabaseError from "$!/errors/database"
import Merger from "!/middlewares/miscellaneous/merger"
import NoContentResponseInfo from "!/response_infos/no_content"
import ActionAuditor from "!/middlewares/miscellaneous/action_auditor"
import DoubleBoundJSONController from "!/controllers/double_bound_json"

import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import string from "!/validators/base/string"
import object from "!/validators/base/object"
import same from "!/validators/comparison/same"
import required from "!/validators/base/required"
import length from "!/validators/comparison/length"
import matchesPassword from "!/validators/manager/matches_password"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			new PermissionBasedPolicy(permissionGroup, [
				UPDATE_OWN_DATA,
				UPDATE_ANYONE_ON_OWN_DEPARTMENT,
				UPDATE_ANYONE_ON_ALL_DEPARTMENTS
			], {
				"requireChangedPassword": false
			}),
			new BelongsToCurrentUserPolicy(Manager, {
				"requireChangedPassword": false
			})
		]) as unknown as Policy
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedRequest): FieldRules {
		const attributes: FieldRules = {
			"password": {
				"constraints": {
					"length": {
						"maximum": 255,
						"minimum": 8
					},
					"same": {
						"pointer": "meta.confirmPassword"
					}
				},
				"pipes": [ required, string, length, same ]
			}
		}

		const meta: Rules = {
			"constraints": {
				"object": {
					"confirmPassword": {
						"constraints": {
							"length": {
								"maximum": 255,
								"minimum": 8
							}
						},
						"pipes": [ required, string, length ]
					},
					"currentPassword": {
						"constraints": {
							"length": {
								"maximum": 255,
								"minimum": 8
							}
						},
						"pipes": [ required, string, length, matchesPassword ]
					}
				}
			},
			"pipes": [ required, object ]
		}

		return makeResourceDocumentRules("user", attributes, {
			"extraQueries": { meta }
		})
	}

	get manager(): BaseManagerClass { return Manager }

	async handle(request: AuthenticatedRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new Manager(request)
		const { id } = request.body.data
		const { password } = request.body.data.attributes

		const isSuccess = await manager.resetPassword(Number(id), password)

		if (isSuccess) {
			return new NoContentResponseInfo()
		}

		throw new DatabaseError("There is a problem with the database. Cannot update the password.")
	}

	get postJobs(): Middleware[] {
		return [
			new ActionAuditor("user.update_password")
		]
	}
}
