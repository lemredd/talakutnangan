import Policy from "!/bases/policy"
import { UPDATE } from "$/permissions/role_combinations"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import { role as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE
		])
	}
}
