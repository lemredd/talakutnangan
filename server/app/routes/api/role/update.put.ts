import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import RoleManager from "%/managers/role"
import JSONController from "!/common_controllers/json_controller"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends JSONController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		// TODO: Use a permission-based policy
		return CommonMiddlewareList.knownOnlyPolicy
	}

	get bodyValidationRules(): object {
		// TODO: Add more constraints in role fields
		// TODO: Check if `min` and `max` rules can accept hex argument instead of decimeal.
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
		const { id, ...attributes } = request.body
		const affectedCount = await manager.update(id, attributes)

		response.status(affectedCount > 0? this.status.NO_CONTENT : this.status.NOT_MODIFIED)
	}
}
