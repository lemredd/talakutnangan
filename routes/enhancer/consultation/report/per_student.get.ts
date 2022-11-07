import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Policy from "!/bases/policy"
import Manager from "%/managers/consultation"
import deserialize from "$/object/deserialize"
import SemesterManager from "%/managers/semester"
import resetToMidnight from "$/time/reset_to_midnight"
import Merger from "!/middlewares/miscellaneous/merger"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"

import { READ } from "$/permissions/semester_combinations"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import { semester as permissionGroup } from "$/permissions/permission_list"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			CommonMiddlewareList.consultationParticipantsOnlyPolicy,
			CommonMiddlewareList.reachableEmployeeOnlyPolicy
		]) as unknown as Policy
	}

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Consultation | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable | any> {
		const manager = new Manager(request)
		const user = deserialize(request.user) as DeserializedUserProfile<"data">
		const currentDate = new Date()
		const rangeBegin = resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1))
		const rangeEnd = adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1))

		const timeConsumedPerStudent = await manager.sumTimePerStudents({
			"filter": {
				"dateTimeRange": {
					"begin": rangeBegin,
					"end": rangeEnd
				},
				"existence": "exists",
				"user": Number(user.data.id)
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "-name" ]
		})

		let semesters: Serializable = {
			"data": [],
			"meta": {
				"count": 0
			}
		}

		const mayViewSemesters = permissionGroup.hasOneRoleAllowed(user.data.roles.data, [
			READ
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

		return {
			semesters,
			timeConsumedPerStudent
		}
	}
}
