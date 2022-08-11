import type { DeserializedUserProfile } from "$/types/documents/user"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "$/helpers/manager"
import Validation from "!/bases/validation"
import PermissionBasedPolicy from "!/policies/permission-based"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [ READ_ANYONE_ON_OWN_DEPARTMENT ])
	}

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		const managerKind = new Manager(request.user as DeserializedUserProfile)
		let Location = ""
		if (managerKind.isStudentServiceLimited()) "/user/employees_list"
		else if (managerKind.isAdmin()) Location = "/admin/resource_config/users"

		response.writeHead(this.status.MOVED_TEMPORARILY, { Location })
		response.end()
	}
}
