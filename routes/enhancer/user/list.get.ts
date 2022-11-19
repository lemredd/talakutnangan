import type { Request } from "!/types/dependent"
import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import deserialize from "$/object/deserialize"
import PermissionBasedPolicy from "!/policies/permission-based"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import { user as permissionGroup } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

import Manager from "%/managers/user"
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
		const manager = new Manager(request)
		const roleManager = new RoleManager(request)
		const departmentManager = new DepartmentManager(request)

		const user = deserialize(request.user) as DeserializedUserProfile<"roles"|"department">
		const mayReadAll = permissionGroup.hasOneRoleAllowed(user.data.roles.data, [
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])

		const pageProps = {
			"departments": mayReadAll
				? {
					"data": [],
					"meta": {
						"count": 0
					}
				}
				: await departmentManager.list({
					"filter": {
						"existence": "exists",
						"slug": ""
					},
					"page": {
						"limit": DEFAULT_LIST_LIMIT,
						"offset": 0
					},
					"sort": [ "fullName" ]
				}),
			"roles": await roleManager.list({
				"filter": {
					"department": "*",
					"existence": "exists",
					"slug": ""
				},
				"page": {
					"limit": DEFAULT_LIST_LIMIT,
					"offset": 0
				},
				"sort": [ "name" ]
			}),
			"users": await manager.list({
				"filter": {
					"department": mayReadAll ? "*" : user.data.department.data.id,
					"existence": "exists",
					"kind": "*",
					"role": "*",
					"slug": ""
				},
				"page": {
					"limit": DEFAULT_LIST_LIMIT,
					"offset": 0
				},
				"sort": [ "name" ]
			})
		}

		return pageProps
	}
}
