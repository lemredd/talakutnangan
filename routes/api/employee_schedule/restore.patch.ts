import type { FieldRules } from "!/types/validation"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type { AuthenticatedRequest, Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import deserialize from "$/helpers/deserialize"
import JSONController from "!/controllers/json"
import AuthorizationError from "$!/errors/authorization"
import NoContentResponseInfo from "!/response_infos/no_content"
import EmployeeScheduleManager from "%/managers/employee_schedule"

import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import archived from "!/validators/manager/archived"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE_OWN_DATA,
			UPDATE_ANYONE_ON_OWN_DEPARTMENT,
			UPDATE_ANYONE_ON_ALL_DEPARTMENTS
		], (request: AuthenticatedRequest) => {
			const user = deserialize(request.user) as DeserializedUserDocument
			const roles = user.data.roles.data
			const hasWidePermission = permissionGroup.hasOneRoleAllowed(
				roles,
				[ UPDATE_ANYONE_ON_OWN_DEPARTMENT, UPDATE_ANYONE_ON_ALL_DEPARTMENTS ]
			)

			if (!hasWidePermission) {
				if (user.data.kind !== "reachable_employee") {
					return Promise.reject(
						new AuthorizationError("Action is not available to the current user.")
					)
				}
			}

			return Promise.resolve()
		})
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return makeResourceIdentifierListDocumentRules(
			"employee_schedule",
			// TODO: Check if the schedules to restore belongs to current user or has enough permission
			archived,
			EmployeeScheduleManager
		)
	}

	async handle(request: Request, unusedResponse: Response): Promise<NoContentResponseInfo> {
		const manager = new EmployeeScheduleManager(request.transaction, request.cache)

		const IDs = request.body.data.map((identifier: { id: number }) => identifier.id)
		await manager.restoreBatch(IDs)

		return new NoContentResponseInfo()
	}
}
