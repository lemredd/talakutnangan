import type { DocumentProps } from "$/types/server"

import Policy from "!/bases/policy"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_ALL_DEPARTMENTS } from "$/permissions/user_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	getDocumentProps(): DocumentProps {
		return {
			"description": "List of departments in Talakutnangan",
			"title": "Department list | Talakutnangan"
		}
	}
}
