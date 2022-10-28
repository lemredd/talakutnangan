import type { DocumentProps } from "$/types/server"

import { DEPARTMENT_LIST } from "$/constants/template_page_paths"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import Middleware from "!/bases/middleware"
import URLMaker from "$!/singletons/url_maker"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import ForceRedirector from "!/middlewares/miscellaneous/force_redirector"

import PermissionBasedPolicy from "!/policies/permission-based"
import { department as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/department_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE,
			UPDATE,
			ARCHIVE_AND_RESTORE
		], {
			"failedRedirectURL": URLMaker.makeBaseURL()
		})
	}

	get postPolicyMiddlewares(): Middleware[] {
		return [
			new ForceRedirector(DEPARTMENT_LIST)
		]
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
