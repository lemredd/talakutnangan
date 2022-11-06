import type { DocumentProps } from "$/types/server"

import Policy from "!/bases/policy"
import { CREATE } from "$/permissions/tag_combinations"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import { tag as permissionGroup } from "$/permissions/permission_list"
import PermissionBasedPolicy from "!/policies/permission-based"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE
		])
	}

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Create Tag | Talakutnangan"
		}
	}
}
