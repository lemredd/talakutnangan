import { FieldRules } from "!/types/validation"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { PasswordResetArguments, BaseManagerClass } from "!/types/independent"
import type { Request, PreprocessedRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Middleware from "!/bases/middleware"
import DatabaseError from "$!/errors/database"
import deserialize from "$/helpers/deserialize"
import NoContentResponseInfo from "!/response_infos/no_content"
import makeDefaultPassword from "$!/helpers/make_default_password"
import BoundJSONController from "!/common_controllers/bound_json_controller"
import PasswordResetNotification from "!/middlewares/email_sender/password_reset_notification"

import { RESET_PASSWORD } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

import object from "!/validators/base/object"
import string from "!/validators/base/string"
import same from "!/validators/comparison/same"
import integer from "!/validators/base/integer"
import required from "!/validators/base/required"

export default class extends BoundJSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			RESET_PASSWORD
		])
	}

	makeBodyRuleGenerator(request: Request): FieldRules {
		return {
			data: {
				pipes: [ required, object],
				constraints: {
					object: {
						type: {
							pipes: [ required, string, same ],
							constraints: {
								same: {
									value: "user"
								}
							}
						},
						id: {
							pipes: [ required, integer ],
							constraints: {}
						}
					}
				}
			}
		}
	}

	get manager(): BaseManagerClass { return UserManager }

	async handle(
		request: Request & PreprocessedRequest<PasswordResetArguments>,
		response: Response
	): Promise<NoContentResponseInfo> {
		const manager = new UserManager(request.transaction, request.cache)
		const id = request.body.data.id
		const userProfile = deserialize(await manager.findWithID(id)) as DeserializedUserProfile
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
