import { FieldRules } from "!/types/validation"
import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/role"
import JSONController from "!/controllers/json"
import NoContentResponseInfo from "!/response_infos/no_content"
import ActionAuditor from "!/middlewares/miscellaneous/action_auditor"

import PermissionBasedPolicy from "!/policies/permission-based"
import { ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"
import { role as permissionGroup } from "$/permissions/permission_list"

import not from "!/validators/comparison/not"
import isTheOnlyRoleToAnyUser from "!/validators/manager/is_the_only_role_to_any_user"
import exists from "!/validators/manager/exists"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"
import areAffectedUsersHaveSurvivingRoles
	from "!/validators/manager/are_affected_users_have_surviving_roles"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			ARCHIVE_AND_RESTORE
		])
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return makeResourceIdentifierListDocumentRules("role", exists, Manager, {
			"postDataRules": {
				"pipes": [ areAffectedUsersHaveSurvivingRoles ]
			},
			"postIDRules": {
				"constraints": {
					"not": {
						"pipes": [ isTheOnlyRoleToAnyUser ]
					}
				},
				"pipes": [ not ]
			}
		})
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new Manager(request)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.archiveBatch(IDs)

		return new NoContentResponseInfo()
	}

	get postJobs(): ActionAuditor[] {
		return [
			new ActionAuditor("role.archive", () => ({ "isSensitive": true }))
		]
	}
}
