import Policy from "!/bases/policy"
import { CREATE } from "$/permissions/role_combinations"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import { role as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/middlewares/authentication/permission-based_policy"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
		])
	}
}
