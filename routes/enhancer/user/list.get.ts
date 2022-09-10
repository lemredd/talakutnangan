import type { DocumentProps } from "$/types/server"

import Policy from "!/bases/policy"
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

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Users | Talakutnangan"
		}
	}
}
