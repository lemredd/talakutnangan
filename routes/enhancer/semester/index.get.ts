import type { DocumentProps } from "$/types/server"

import { SEMESTER_LIST, HOME } from "$/constants/template_page_paths"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import Middleware from "!/bases/middleware"
import URLMaker from "$!/singletons/url_maker"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import ForceRedirector from "!/middlewares/miscellaneous/force_redirector"

import PermissionBasedPolicy from "!/policies/permission-based"
import { semester as permissionGroup } from "$/permissions/permission_list"
import { CREATE, UPDATE, ARCHIVE_AND_RESTORE } from "$/permissions/semester_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			CREATE,
			UPDATE,
			ARCHIVE_AND_RESTORE
		], {
			"failedRedirectURL": URLMaker.makeURLFromPath(HOME)
		})
	}

	get postPolicyMiddlewares(): Middleware[] {
		return [
			new ForceRedirector(SEMESTER_LIST)
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
