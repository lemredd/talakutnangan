import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type {
	DeserializedUserProfile,
	DeserializedUserListWithTimeConsumedDocument
} from "$/types/documents/user"
import deserialize from "$/object/deserialize"

import Policy from "!/bases/policy"
import Manager from "%/managers/consultation"
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
			"title": "Consultation | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable | any> {
		const manager = new Manager(request)
		const user = deserialize(request.user) as DeserializedUserProfile

		const totalMillisecondsConsumed = await manager.sumTimePerStudents({
			"filter": {
				"dateTimeRange": {
					"begin": new Date("2022-10-01T00:00:00"),
					"end": new Date("2022-10-30T11:59:59")
				},
				"existence": "exists",
				"user": Number(user.data.id)
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "-name" ]
		}) as DeserializedUserListWithTimeConsumedDocument

		console.log(totalMillisecondsConsumed)

		return {
			totalMillisecondsConsumed
		}
	}
}
