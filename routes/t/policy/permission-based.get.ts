import type { Request, Response } from "!/types/dependent"
import type { FieldRules } from "!/types/validation"

import Policy from "!/bases/policy"
import QueryController from "!/common_controllers/query_controller"

import { READ_OWN } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

export default class extends QueryController {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [ READ_OWN ])
	}

	makeQueryRuleGenerator(request: Request): FieldRules {
		return {}
	}

	async handle(request: Request, response: Response): Promise<void> {
		response.status(this.status.OK)
	}
}
