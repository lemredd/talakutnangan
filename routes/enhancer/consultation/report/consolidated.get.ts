import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Policy from "!/bases/policy"
import Manager from "%/managers/consultation"
import deserialize from "$/object/deserialize"
import resetToMidnight from "$/time/reset_to_midnight"
import Merger from "!/middlewares/miscellaneous/merger"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"

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
			"title": "Consolidated Consultation Report | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable | any> {
		const manager = new Manager(request)
		const user = deserialize(request.user) as DeserializedUserProfile
		const currentDate = new Date()
		const rangeStart = resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1))
		const rangeEnd = adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1))

		const timeConsumedforConsolidation = await manager.sumTimeForConsolidation({
			"filter": {
				"dateTimeRange": {
					"begin": rangeStart,
					"end": rangeEnd
				},
				"existence": "exists",
				"user": Number(user.data.id)
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "id" ]
		})

		return {
			timeConsumedforConsolidation
		}
	}
}
