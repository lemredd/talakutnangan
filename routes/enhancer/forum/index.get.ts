import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Policy from "!/bases/policy"
import Manager from "%/managers/post"
import deserialize from "$/object/deserialize"
import DepartmentManager from "%/managers/department"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import PermissionBasedPolicy from "!/policies/permission-based"
import { post as permissionGroup } from "$/permissions/permission_list"
import {
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/post_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	getDocumentProps(): DocumentProps {
		return {
			"description": "Forum in Talakutnangan",
			"title": "Forum | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable> {
		const manager = new Manager(request)
		const departmentManager = new DepartmentManager(request)
		const userProfile = deserialize(request.user) as DeserializedUserProfile<"roles"|"department">

		const roles = userProfile.data.roles.data
		const mayViewAllDepartments = permissionGroup.hasOneRoleAllowed(
			roles,
			[ READ_ANYONE_ON_ALL_DEPARTMENTS ]
		)
		const unusedDepartment = mayViewAllDepartments ? "*" : userProfile.data.department.data.id

		const pageProps = {
			"departments": mayViewAllDepartments
				? await departmentManager.list({
					"filter": {
						"existence": "exists"
					},
					"page": {
						"limit": 10,
						"offset": 0
					},
					"sort": [ "fullName" ]
				})
				: [],
			"posts": await manager.list({
				"filter": {
					// TODO: Filter the posts by department
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
