import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Policy from "!/bases/policy"
import Manager from "%/managers/consultation"
import deserialize from "$/object/deserialize"
import Merger from "!/middlewares/miscellaneous/merger"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

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
			"title": "Weekly Consultation Report | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable | any> {
		const manager = new Manager(request)
		const user = deserialize(request.user) as DeserializedUserProfile
		const currentDate = new Date()
		const rangeBegin = resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1))
		const rangeEnd = adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1))

		const timeConsumedPerWeek = await manager.sumTimePerWeek({
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

		return {
			timeConsumedPerWeek
		}
	}
}
