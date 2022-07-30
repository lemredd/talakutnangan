import type { UserProfile } from "$/types/common_front-end"
import type { PasswordResetArguments, BaseManagerClass } from "!/types/independent"
import type { AuthenticatedIDRequest, PreprocessedRequest, Response } from "!/types/dependent"
import { FieldRules } from "!/types/independent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Middleware from "!/bases/middleware"
import DatabaseError from "$!/errors/database"
import deserialize from "$/helpers/deserialize"
import NoContentResponseInfo from "!/response_infos/no_content"
import { RESET_PASSWORD } from "$/permissions/user_combinations"
import makeDefaultPassword from "$!/helpers/make_default_password"
import { user as permissionGroup } from "$/permissions/permission_list"
import BoundJSONController from "!/common_controllers/bound_json_controller"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"
import PasswordResetNotification from "!/middlewares/email_sender/password_reset_notification"
import { FieldRulesMaker } from "!/types/hybrid"

import object from "!/app/validators/base/object"
import required from "!/app/validators/base/required"
import same from "!/app/validators/comparison/same"
import string from "!/app/validators/base/string"
import integer from "!/app/validators/base/integer"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			RESET_PASSWORD
		])
	}

	get bodyValidationRules(): object {
		return {
			"data": [ "required", "object" ],
			"data.type": [ "required", "string", "equals:user" ],
			"data.id": [ "required", "numeric" ]
		}
	}

	makeBodyRuleGenerator(): FieldRulesMaker {
		return (request: AuthenticatedIDRequest): FieldRules => ({
			data: {
				pipes: [ required, object],
				constraints: {
					object: {
						type: {
							pipes: [ required, string, same ],
							constraints: {
								same: "user"
							}
						},
						id: {
							pipes: [ required, integer ],
							constraints: {}
						}
					}
				}
			}
		})
	}

	get manager(): BaseManagerClass { return UserManager }

	async handle(
		request: AuthenticatedIDRequest & PreprocessedRequest<PasswordResetArguments>,
		response: Response
	): Promise<NoContentResponseInfo> {
		const manager = new UserManager()
		const id = request.body.data.id
		const userProfile = deserialize(await manager.findWithID(id)) as UserProfile
		const newPassword = makeDefaultPassword(userProfile)
		const isSuccess = await manager.resetPassword(id, newPassword)

		if (isSuccess) {
			request.nextMiddlewareArguments = {
				emailToContact: {
					email: userProfile.data.email,
					name: userProfile.data.name,
					password: newPassword
				}
			}

			return new NoContentResponseInfo()
		} else {
			throw new DatabaseError("There is a problem with the database. Cannot reset the password.")
		}
	}

	get postJobs(): Middleware[] {
		return [
			new PasswordResetNotification()
		]
	}
}
