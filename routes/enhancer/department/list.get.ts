import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"
import type { AuthenticatedRequest } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/department"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import { CREATE } from "$/permissions/department_combinations"
import PermissionBasedPolicy from "!/policies/permission-based"
import { department as permissionGroup } from "$/permissions/permission_list"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [ CREATE ])
	}

	getDocumentProps(): DocumentProps {
		return {
			"description": "List of departments in Talakutnangan",
			"title": "Department list | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable> {
		const manager = new Manager(request)

		const pageProps = {
			"departments": await manager.list({
				"filter": {
					"existence": "exists"
				},
				"page": {
					"limit": 10,
					"offset": 0
				},
				"sort": [ "fullName" ]
			})
		}

		return pageProps
	}
}
