import { Serializable } from "$/types/database"
import type { UserProfile } from "$/types/common_front-end"
import type { EmailVerificationArguments } from "!/types/independent"
import type { AuthenticatedIDRequest, PreprocessedRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Middleware from "!/bases/middleware"
import Validation from "!/bases/validation"
import deserialize from "$/helpers/deserialize"
import AuthorizationError from "$!/errors/authorization"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import { user as permissionGroup } from "$/permissions/permission_list"
import MultipartController from "!/common_controllers/multipart_controller"
import IDParameterValidation from "!/middlewares/authorization/id_parameter_validation"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"
import {
	UPDATE_OWN_DATA,
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

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
			new IDParameterValidation(),
			...super.validations
		]
	}

	get bodyValidationRules(): object {
		return {
			// TODO: Make validator for names
			name: [ "required", "string" ],
			email: [ "required", "string", "email" ],
			// TODO: Make buffer validator handle multiple MIME types and null
			// signature: [ "nullable", "buffer:image/png" ]
		}
	}

	async handle(
		request: AuthenticatedIDRequest & PreprocessedRequest<EmailVerificationArguments>,
		response: Response
	): Promise<void> {
		const manager = new UserManager()
		const  id = +request.params.id
		const { name, email, signature = undefined } = request.body
		const userData = deserialize(request.user) as UserProfile
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

		const oldUser = deserialize(await manager.findWithID(id)) as UserProfile
		const oldEmail = oldUser.data.email

		if (oldEmail !== email) {
			request.nextMiddlewareArguments = {
				emailsToContact: [ email ]
			}
			updateData.emailVerifiedAt = null
		} else {
			request.nextMiddlewareArguments = {
				emailsToContact: []
			}
		}

		if (signature) updateData.signature = signature.buffer

		const affectedCount = await manager.update(id, updateData)

		response.status(affectedCount > 0? this.status.NO_CONTENT : this.status.NOT_MODIFIED)
		response.end()
	}

	get postJobs(): Middleware[] {
		return [
			CommonMiddlewareList.emailVerification
		]
	}
}
