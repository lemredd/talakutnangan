import type { Serializable } from "$/types/general"
import type { FieldRules } from "!/types/validation"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { EmailVerificationArguments } from "!/types/independent"
import type { AuthenticatedIDRequest, PreprocessedRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Middleware from "!/bases/middleware"
import Validation from "!/bases/validation"
import deserialize from "$/helpers/deserialize"
import AuthorizationError from "$!/errors/authorization"
import NoContentResponseInfo from "!/response_infos/no_content"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import IDParameterValidation from "!/middlewares/validation/id_parameter"
import MultipartController from "!/common_controllers/multipart_controller"
import MatchedIDParameterValidation from "!/middlewares/validation/matched_id_parameter"

import { user as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import object from "!/app/validators/base/object"
import string from "!/app/validators/base/string"
import same from "!/app/validators/comparison/same"
import integer from "!/app/validators/base/integer"
import unique from "!/app/validators/manager/unique"
import required from "!/app/validators/base/required"
import regex from "!/app/validators/comparison/regex"

export default class extends MultipartController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE_OWN_DATA,
			UPDATE_ANYONE_ON_OWN_DEPARTMENT,
			UPDATE_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	get validations(): Validation[] {
		return [
			new IDParameterValidation([
				[ "id", UserManager ]
			]),
			...super.validations,
			new MatchedIDParameterValidation()
		]
	}

	makeBodyRuleGenerator(request: AuthenticatedIDRequest): FieldRules {
		return {
			data: {
				pipes: [ required, object ],
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
						},
						attributes: {
							pipes: [ required, object],
							constraints: {
								object: {
									name: {
										// TODO: Validate the name
										pipes: [ required, string ],
										constraints: {}
									},
									email: {
										// TODO: Make email validator
										pipes: [ required, string, regex, unique ],
										constraints: {
											regex: {
												match: /.+@.+/
											},
											manager: {
												className: UserManager,
												columnName: "email"
											},
											unique: {
												IDPath: "data.id"
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	async handle(
		request: AuthenticatedIDRequest & PreprocessedRequest<EmailVerificationArguments>,
		response: Response
	): Promise<NoContentResponseInfo> {
		const manager = new UserManager(request.transaction, request.cache)
		const id = +request.body.data.id
		const { name, email, signature = undefined } = request.body.data.attributes
		const userData = deserialize(request.user) as DeserializedUserProfile
		const updateData: Serializable = { name, email }

		if (
			!permissionGroup.hasOneRoleAllowed(
				userData.data.roles.data,
				[ UPDATE_ANYONE_ON_OWN_DEPARTMENT, UPDATE_ANYONE_ON_ALL_DEPARTMENTS ]
			)
			&& userData.data.id !== id
		) {
			throw new AuthorizationError("User is not permitted to edit other users")
		}

		const oldUser = deserialize(await manager.findWithID(id)) as DeserializedUserProfile
		const oldEmail = oldUser.data.email

		if (oldEmail !== email) {
			request.nextMiddlewareArguments = {
				emailsToContact: [
					{
						id,
						email
					}
				]
			}
			updateData.emailVerifiedAt = null
		} else {
			request.nextMiddlewareArguments = {
				emailsToContact: []
			}
		}

		if (signature) updateData.signature = signature.buffer

		await manager.update(id, updateData)

		return new NoContentResponseInfo()
	}

	get postJobs(): Middleware[] {
		return [
			CommonMiddlewareList.emailVerification
		]
	}
}
