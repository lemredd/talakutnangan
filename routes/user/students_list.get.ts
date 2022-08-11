import PageMiddleware from "!/bases/controller-likes/page_middleware"
import Policy from "!/bases/policy"
import { user as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_ANYONE_ON_OWN_DEPARTMENT
		])
	}
}
