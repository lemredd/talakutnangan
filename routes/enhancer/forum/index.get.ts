import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { DeserializedPostListDocument } from "$/types/documents/post"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Policy from "!/bases/policy"
import Manager from "%/managers/post"
import deserialize from "$/object/deserialize"
import SemesterManager from "%/managers/semester"
import DepartmentManager from "%/managers/department"
import resetToMidnight from "$/time/reset_to_midnight"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"

import PermissionBasedPolicy from "!/policies/permission-based"
import { post as permissionGroup } from "$/permissions/permission_list"
import { READ as READ_SEMESTERS } from "$/permissions/semester_combinations"
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

		const currentDate = new Date()
		const rangeBegin = resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1))
		const rangeEnd = adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1))

		const roles = userProfile.data.roles.data
		const mayViewAllDepartments = permissionGroup.hasOneRoleAllowed(
			roles,
			[ READ_ANYONE_ON_ALL_DEPARTMENTS ]
		)
		const department = Number(userProfile.data.department.data.id)
		const posts = await manager.list({
			"filter": {
				"dateTimeRange": {
					"begin": rangeBegin,
					"end": rangeEnd
				},
				"departmentID": department,
				"existence": "exists"
			},
			"page": {
				"limit": DEFAULT_LIST_LIMIT,
				"offset": 0
			},
			"sort": [ "-createdAt" ]
		}) as DeserializedPostListDocument<"poster"|"posterRole"|"department">

		let semesters: Serializable = {
			"data": [],
			"meta": {
				"count": 0
			}
		}

		const mayViewSemesters = permissionGroup.hasOneRoleAllowed(userProfile.data.roles.data, [
			READ_SEMESTERS
		])
		if (mayViewSemesters) {
			const semesterManager = new SemesterManager(request)

			semesters = await semesterManager.list({
				"filter": {
					"existence": "exists",
					"slug": ""
				},
				"page": {
					"limit": DEFAULT_LIST_LIMIT,
					"offset": 0
				},
				"sort": [ "name" ]
			})
		}

		const pageProps = {
			"departments": mayViewAllDepartments
				? await departmentManager.list({
					"filter": {
						"existence": "exists",
						"slug": ""
					},
					"page": {
						"limit": DEFAULT_LIST_LIMIT,
						"offset": 0
					},
					"sort": [ "fullName" ]
				})
				: {
					"data": [],
					"meta": {
						"count": 0
					}
				},
			posts,
			semesters
		}

		return pageProps
	}
}
