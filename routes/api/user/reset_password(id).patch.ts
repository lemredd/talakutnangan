import { FieldRules } from "!/types/validation"
import type { PasswordResetArguments } from "!/types/independent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { Request, PreprocessedRequest, Response, BaseManagerClass } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Middleware from "!/bases/middleware"
import DatabaseError from "$!/errors/database"
import deserialize from "$/object/deserialize"
import NoContentResponseInfo from "!/response_infos/no_content"
import makeDefaultPassword from "$!/helpers/make_default_password"
import ActionAuditor from "!/middlewares/miscellaneous/action_auditor"
import DoubleBoundJSONController from "!/controllers/double_bound_json"
import PasswordResetNotification from "!/middlewares/email_sender/password_reset_notification"

import PermissionBasedPolicy from "!/policies/permission-based"
import { RESET_PASSWORD } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"

import object from "!/validators/base/object"
import required from "!/validators/base/required"
import exists from "!/validators/manager/exists"
import makeResourceIdentifierRules from "!/rule_sets/make_resource_identifier"

export default class extends DoubleBoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			RESET_PASSWORD
		])
	}

	makeBodyRuleGenerator(unusedRequest: Request): FieldRules {
		return {
			"data": {
				"constraints": {
					"object": makeResourceIdentifierRules("user", exists, UserManager, {
						"mustCastID": false
					})
				},
				"pipes": [ required, object ]
			}
		}
	}

	get manager(): BaseManagerClass { return UserManager }

	async handle(
		request: Request & PreprocessedRequest<PasswordResetArguments>,
		unusedResponse: Response
	): Promise<NoContentResponseInfo> {
		const manager = new UserManager(request)
		const { id } = request.body.data
		const userProfile = deserialize(await manager.findWithID(id)) as DeserializedUserProfile
		const newPassword = makeDefaultPassword(userProfile)
		const isSuccess = await manager.resetPassword(Number(id), newPassword)

		if (isSuccess) {
			request.nextMiddlewareArguments = {
				"emailToContact": {
					"email": userProfile.data.email,
					"name": userProfile.data.name,
					"password": newPassword
				}
			}

			return new NoContentResponseInfo()
		}
		throw new DatabaseError("There is a problem with the database. Cannot reset the password.")
	}

	get postJobs(): Middleware[] {
		return [
			new PasswordResetNotification(),
			new ActionAuditor("user.reset_password", () => ({ "isSensitive": true }))
		]
	}
}
