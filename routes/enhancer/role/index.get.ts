import type { DocumentProps } from "$/types/server"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import PermissionBasedPolicy from "!/policies/permission-based"
import { role as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/role_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE,
			UPDATE,
			ARCHIVE_AND_RESTORE
		])
	}


	get bodyParser(): null { return null }

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Users | Talakutnangan"
		}
	}

	get validations(): Validation[] { return [] }
}
