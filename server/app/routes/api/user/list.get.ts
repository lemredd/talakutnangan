import { rawCriteria, Criteria } from "$/types/database"
import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import QueryController from "!/common_controllers/query_controller"
import { user as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

interface WithQuery {
	query: {
		criteria?: Criteria
	}
}

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	get queryValidationRules(): object {
		return {
			criteria: [ "required", [ "in", ...rawCriteria ] ]
		}
	}

	async handle(request: Request & WithQuery, response: Response): Promise<void> {
		const { criteria = null } = request.query
		const manager = new UserManager()
		const users = await manager.list({ criteria })

		// TODO: Hide the signatures of users
		response.status(this.status.OK).json(users)
	}
}
