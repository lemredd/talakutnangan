import type { Serializable } from "$/types/general"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { EmailVerificationArguments } from "!/types/independent"
import type { AuthenticatedIDRequest, PreprocessedRequest, Response } from "!/types/dependent"
import { FieldRules } from "!/types/independent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Middleware from "!/bases/middleware"
import Validation from "!/bases/validation"
import deserialize from "$/helpers/deserialize"
import AuthorizationError from "$!/errors/authorization"
import NoContentResponseInfo from "!/response_infos/no_content"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import { user as permissionGroup } from "$/permissions/permission_list"
import IDParameterValidation from "!/middlewares/validation/id_parameter"
import MultipartController from "!/common_controllers/multipart_controller"
import MatchedIDParameterValidation from "!/middlewares/validation/matched_id_parameter"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import object from "!/app/validators/base/object"
import required from "!/app/validators/base/required"
import same from "!/app/validators/comparison/same"
import string from "!/app/validators/base/string"
import { FieldRulesMaker } from "!/types/hybrid"
import integer from "!/app/validators/base/integer"
import unique from "!/app/validators/manager/unique"
import nullable from "!/app/validators/base/nullable"

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

	get bodyValidationRules(): object {
		return {
			"data":				[ "required", "object" ],
			"data.type":		[ "required", "string", "equals:user" ],
			"data.id":			[ "required", "numeric" ],
			"data.attributes":[ "required", "object" ],
			// TODO: Make validator for names
			"data.attributes.name": [ "required", "string" ],
			"data.attributes.email": [
				"required",
				"string",
				"email",
				[ "unique", UserManager, "email", "data.id" ]
			]
		}
	}

	makeBodyRuleGenerator(): FieldRulesMaker {
		return (request: AuthenticatedIDRequest): FieldRules => ({
			data: {
				pipes: [ required, object ],
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
						},
						attributes: {
							pipes: [ required, object],
							constraints: {
								object: {
									name: {
										pipes: [ required, string ],
										constraints: {}
									},
									email: {
										pipes: [ required, string, unique],
										constraints: {
											manager: {
												className: UserManager,
												columnName: "email"
											},
											unique: {
												IDPath: "data.id"
											}
										}
									},
									signature: {
										pipes: [ nullable ],
										constraints: {
											buffer: {
												allowedMimeTypes: [ "image/png" ],
												maxSize: 1024 * 1024 * 10
											}
										}
									}
								}
							}
						}
					}
				}
			}
		})
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
