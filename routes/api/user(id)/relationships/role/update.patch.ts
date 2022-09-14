import type { FieldRules } from "!/types/validation"
import type { BaseManagerClass } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { RoleIdentifierListDocument } from "$/types/documents/role"
import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Log from "$!/singletons/log"
import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import RoleManager from "%/managers/role"
import deserialize from "$/object/deserialize"
import AuthorizationError from "$!/errors/authorization"
import BoundJSONController from "!/controllers/bound_json"
import NoContentResponseInfo from "!/response_infos/no_content"

import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import { UPDATE_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/user_combinations"

import exists from "!/validators/manager/exists"
import makeResourceIdentifierListDocumentRules
	from "!/rule_sets/make_resource_identifier_list_document"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE_ANYONE_ON_ALL_DEPARTMENTS
		], (request: AuthenticatedIDRequest): Promise<void> => {
			const userData = deserialize(request.user) as DeserializedUserProfile
			const userID = Number(userData.data.id)
			const targetUserID = Number(request.params.id)

			if (userID === targetUserID) {
				return Promise.reject(
					new AuthorizationError("Users cannot edit the attached roles to themselves.")
				)
			}

			return Promise.resolve()
		})
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedIDRequest): FieldRules {
		return makeResourceIdentifierListDocumentRules("role", exists, RoleManager)
	}

	get manager(): BaseManagerClass { return UserManager }

	async handle(request: AuthenticatedIDRequest, unusedResponse: Response)
	: Promise<NoContentResponseInfo> {
		const manager = new RoleManager(request)
		const { data } = request.body as RoleIdentifierListDocument<"read">
		const userData = deserialize(request.user) as DeserializedUserProfile
		const userID = Number(userData.data.id)

		await manager.reattach(userID, data.map(identifier => Number(identifier.id)))
		Log.success("controller", "successfully updated the roles of the user")

		return new NoContentResponseInfo()
	}
}
