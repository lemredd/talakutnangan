import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { DeserializedPostListDocument } from "$/types/documents/post"

import Policy from "!/bases/policy"
import Manager from "%/managers/post"
import deserialize from "$/object/deserialize"
import CommentManager from "%/managers/comment"
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
		const commentManager = new CommentManager(request)
		const departmentManager = new DepartmentManager(request)
		const userProfile = deserialize(request.user) as DeserializedUserProfile<"roles"|"department">

		const roles = userProfile.data.roles.data
		const mayViewAllDepartments = permissionGroup.hasOneRoleAllowed(
			roles,
			[ READ_ANYONE_ON_ALL_DEPARTMENTS ]
		)
		const department = mayViewAllDepartments ? null : Number(userProfile.data.department.data.id)
		const posts = await manager.list({
			"filter": {
				"departmentID": department,
				"existence": "exists"
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "-createdAt" ]
		}) as DeserializedPostListDocument<"poster"|"posterRole"|"department">
		const comments = await commentManager.list({
			"filter": {
				"existence": "exists"
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "-created" ]
		})

		const pageProps = {
			comments,
			"departments": mayViewAllDepartments
				? await departmentManager.list({
					"filter": {
						"existence": "exists",
						"slug": ""
					},
					"page": {
						"limit": 10,
						"offset": 0
					},
					"sort": [ "fullName" ]
				})
				: [],
			posts
		}

		return pageProps
	}
}
