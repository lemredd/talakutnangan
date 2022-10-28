import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"
import type { AuthenticatedRequest } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/role"
import Validation from "!/bases/validation"
import DepartmentManager from "%/managers/department"
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

	get validations(): Validation[] { return [] }

	getDocumentProps(): DocumentProps {
		return {
			"description": "List of roles available that can be attached to users",
			"title": "Role list | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable> {
		const manager = new Manager(request)
		const departmentManager = new DepartmentManager(request)
		const pageProps = {
			"departments": await departmentManager.list({
				"filter": {
					"existence": "exists",
					"slug": ""
				},
				"page": {
					"limit": Infinity,
					"offset": 0
				},
				"sort": [ "fullName" ]
			}),
			"roles": await manager.list({
				"filter": {
					"department": "*",
					"existence": "exists",
					"slug": ""
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
