import type { Request } from "!/types/dependent"
import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import PermissionBasedPolicy from "!/policies/permission-based"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

import RoleManager from "%/managers/role"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [ READ_ANYONE_ON_OWN_DEPARTMENT ])
	}

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	getDocumentProps(): DocumentProps {
		return {
			"description": "List of roles available that can be attached to users",
			"title": "Role list | Talakutnangan"
		}
	}

	async getPageProps(request: Request): Promise<Serializable> {
		const roleManager = new RoleManager(request.transaction, request.cache)
		const pageProps = {
			"roles": await roleManager.list({
				"filter": {
					"department": "*",
					"existence": "exists"
				},
				"page": {
					"limit": 10,
					"offset": 0
				},
				"sort": [ "name" ]
			})
		}

		return pageProps
	}
}
