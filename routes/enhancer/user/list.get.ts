import type { Request } from "!/types/dependent"
import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import PermissionBasedPolicy from "!/policies/permission-based"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import { user as permissionGroup } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import RoleManager from "%/managers/role"
import DepartmentManager from "%/managers/department"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Users | Talakutnangan"
		}
	}

	async getPageProps(request: Request): Promise<Serializable> {
		const roleManager = new RoleManager(request)
		const departmentManager = new DepartmentManager(request)
		const pageProps = {
			"departments": await departmentManager.list({
				"filter": {
					"existence": "exists"
				},
				"page": {
					"limit": 10,
					"offset": 0
				},
				"sort": [ "fullName" ]
			}),
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
