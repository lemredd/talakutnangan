import type { AuthenticatedIDRequest, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import UserManager from "%/managers/user"
import { READ_OWN } from "$/permissions/user_combinations"
import QueryController from "!/common_controllers/query_controller"
import { user as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [ READ_OWN ])
	}

	get queryValidationRules(): object {
		return {}
	}

	async handle(request: AuthenticatedIDRequest, response: Response): Promise<void> {
		response.status(this.status.OK)
	}
}
