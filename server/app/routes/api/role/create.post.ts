import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import { CREATE } from "$/permissions/role_combinations"
import JSONController from "!/common_controllers/json_controller"
import { role as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
		])
	}

	get bodyValidationRules(): object {
		// TODO: Add more constraints in role fields
		// TODO: Check if `min` and `max` rules can accept hex argument instead of decimal.
		return {
			name:					[ "required", "string" ],
			departmentFlags:	[ "required", "numeric" ],
			roleFlags:			[ "required", "numeric" ],
			semesterFlags:		[ "required", "numeric" ],
			tagFlags:			[ "required", "numeric" ],
			postFlags:			[ "required", "numeric" ],
			commentFlags:		[ "required", "numeric" ],
			profanityFlags:	[ "required", "numeric" ],
			userFlags:			[ "required", "numeric" ],
			auditTrailFlags:	[ "required", "numeric" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new RoleManager()
		const roleInfo = await manager.create(request.body)

		response.status(this.status.CREATED).json(roleInfo)
	}
}
