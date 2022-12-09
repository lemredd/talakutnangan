import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { Request, AuthenticatedRequest } from "!/types/dependent"

import Manager from "%/managers/post"
import deserialize from "$/object/deserialize"
import resetToMidnight from "$/time/reset_to_midnight"
import adjustUntilChosenDay from "$/time/adjust_until_chosen_day"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import adjustBeforeMidnightOfNextDay from "$/time/adjust_before_midnight_of_next_day"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Home | Talakutnangan"
		}
	}

	async getPageProps(request: Request): Promise<Serializable> {
		const hasProfile = Boolean(request.user)
		const posts = hasProfile ? await this.loadPosts(request as AuthenticatedRequest) : null

		const pageProps = {
			posts
		}

		return pageProps
	}

	private async loadPosts(request: AuthenticatedRequest): Promise<Serializable> {
		const manager = new Manager(request)
		const userProfile = deserialize(request.user) as DeserializedUserProfile<"roles"|"department">

		const currentDate = new Date()
		const rangeBegin = resetToMidnight(adjustUntilChosenDay(currentDate, 0, -1))
		const rangeEnd = adjustBeforeMidnightOfNextDay(adjustUntilChosenDay(currentDate, 6, 1))

		const department = Number(userProfile.data.department.data.id)
		const posts = await manager.list({
			"filter": {
				"dateTimeRange": {
					"begin": rangeBegin,
					"end": rangeEnd
				},
				"departmentID": department,
				"existence": "exists",
				"tagIDs": "*"
			},
			"page": {
				"limit": 3,
				"offset": 0
			},
			"sort": [ "-createdAt" ]
		})

		return posts
	}
}
