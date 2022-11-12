import type { DocumentProps } from "$/types/server"

import { AUDIT_TRAIL_LIST, HOME } from "$/constants/template_page_paths"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import Middleware from "!/bases/middleware"
import URLMaker from "$!/singletons/url_maker"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import ForceRedirector from "!/middlewares/miscellaneous/force_redirector"

import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import { READ } from "$/permissions/audit_trail_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ
		], {
			"failedRedirectURL": URLMaker.makeURLFromPath(HOME)
		})
	}

	get postPolicyMiddlewares(): Middleware[] {
		return [
			new ForceRedirector(AUDIT_TRAIL_LIST)
		]
	}

	get bodyParser(): null { return null }

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Audit Trails | Talakutnangan"
		}
	}

	get validations(): Validation[] { return [] }
}
