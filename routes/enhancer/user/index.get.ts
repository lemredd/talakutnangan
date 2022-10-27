import type { DocumentProps } from "$/types/server"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import Policy from "!/bases/policy"
import Middleware from "!/bases/middleware"
import Validation from "!/bases/validation"
import PermissionBasedPolicy from "!/policies/permission-based"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import ForceRedirector from "!/middlewares/miscellaneous/force_redirector"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
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

	get postValidationMiddlewares(): Middleware[] {
		return [
			new ForceRedirector("/user/list")
		]
	}
}
