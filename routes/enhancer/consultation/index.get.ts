import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Policy from "!/bases/policy"
import Manager from "%/managers/consultation"
import deserialize from "$/helpers/deserialize"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable> {
		const user = deserialize(request.user) as DeserializedUserProfile
		const manager = new Manager(request.transaction, request.cache)

		const consultations = await manager.list({
			"filter": {
				"existence": "exists",
				"user": Number(user.data.id)
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "-updatedAt" ]
		})

		return {
			consultations
		}
	}
}
