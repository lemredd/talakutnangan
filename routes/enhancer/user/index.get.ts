import type { AuthenticatedRequest } from "!/types/dependent"
import type { DocumentProps } from "$/types/server"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import deserialize from "$/object/deserialize"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import DynamicGatedRedirector from "!/middlewares/miscellaneous/dynamic_gated_redirector"

import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	UPDATE_ANYONE_ON_OWN_DEPARTMENT,
	UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
	ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT,
	ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT,
	RESET_PASSWORD,
	IMPORT_USERS
} from "$/permissions/user_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			UPDATE_ANYONE_ON_OWN_DEPARTMENT,
			UPDATE_ANYONE_ON_ALL_DEPARTMENTS,
			ARCHIVE_AND_RESTORE_ANYONE_ON_OWN_DEPARTMENT,
			ARCHIVE_AND_RESTORE_ANYONE_ON_ALL_DEPARTMENT,
			RESET_PASSWORD,
			IMPORT_USERS
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
