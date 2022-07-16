import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import Validation from "!/bases/validation"
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
			// TODO: Make buffer validator handle multiple MIME types
			signature: [ "required", "buffer:image/png" ]
		}
	}

	async handle(request: AuthenticatedIDRequest, response: Response): Promise<void> {
		const manager = new UserManager()
		const { id } = request.params

		// TODO: Update user details

		response.status(this.status.NOT_IMPLEMENTED)
	}
}
