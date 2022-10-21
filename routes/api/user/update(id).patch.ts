import type { Serializable } from "$/types/general"
import type { FieldRules } from "!/types/validation"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { EmailVerificationArguments } from "!/types/independent"
import type {
	AuthenticatedIDRequest,
	PreprocessedRequest,
	Response,
	BaseManagerClass
} from "!/types/dependent"

import { personName, personNameDescription } from "$!/constants/regex"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Middleware from "!/bases/middleware"
import deserialize from "$/object/deserialize"
import AuthorizationError from "$!/errors/authorization"
import NoContentResponseInfo from "!/response_infos/no_content"
import DoubleBoundJSONController from "!/controllers/double_bound_json"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import string from "!/validators/base/string"
import boolean from "!/validators/base/boolean"
import unique from "!/validators/manager/unique"
import regex from "!/validators/comparison/regex"
import required from "!/validators/base/required"
import emailValidator from "!/validators/comparison/email"
import makeResourceDocumentRules from "!/rule_sets/make_resource_document"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE_OWN_DATA,
			UPDATE_ANYONE_ON_OWN_DEPARTMENT,
			UPDATE_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	makeBodyRuleGenerator(unusedRequest: AuthenticatedIDRequest): FieldRules {
		const attributes: FieldRules = {
			"email": {
				"constraints": {
					"manager": {
						"className": UserManager,
						"columnName": "email"
					},
					"unique": {
						"IDPath": "data.id"
					}
				},
				"pipes": [ required, string, emailValidator, unique ]
			},
			"name": {
				"constraints": {
					"regex": {
						"friendlyDescription": personNameDescription,
						"match": personName
					}
				},
				"pipes": [ required, string, regex ]
			},
			"prefersDark": {
				"pipes": [ required, boolean ]
			}
		}

		return makeResourceDocumentRules("user", attributes)
	}

	get manager(): BaseManagerClass { return UserManager }

	async handle(
		request: AuthenticatedIDRequest & PreprocessedRequest<EmailVerificationArguments>,
		unusedResponse: Response
	): Promise<NoContentResponseInfo> {
		const manager = new UserManager(request)
		const { id } = request.body.data
		const { email } = request.body.data.attributes

		const userData = deserialize(request.user) as DeserializedUserProfile<"roles">
		const updateData: Serializable = request.body.data.attributes

		if (
			!permissionGroup.hasOneRoleAllowed(
				userData.data.roles.data,
				[ UPDATE_ANYONE_ON_OWN_DEPARTMENT, UPDATE_ANYONE_ON_ALL_DEPARTMENTS ]
			)
			&& String(userData.data.id) !== String(id)
		) {
			throw new AuthorizationError("User is not permitted to edit other users")
		}

		const oldUser = deserialize(await manager.findWithID(id)) as DeserializedUserProfile
		const oldEmail = oldUser.data.email

		if (oldEmail === email) {
			request.nextMiddlewareArguments = {
				"emailsToContact": []
			}
		} else {
			request.nextMiddlewareArguments = {
				"emailsToContact": [
					{
						email,
						id
					}
				]
			}
			updateData.emailVerifiedAt = null
		}

		await manager.update(id, updateData)

		return new NoContentResponseInfo()
	}

	get postJobs(): Middleware[] {
		return [
			CommonMiddlewareList.emailVerification
		]
	}
}
