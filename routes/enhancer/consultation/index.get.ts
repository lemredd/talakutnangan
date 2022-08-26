import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { ConsultationListDocument } from "$/types/documents/consultation"

import Policy from "!/bases/policy"
import Middleware from "!/bases/middleware"
import Manager from "%/managers/consultation"
import deserialize from "$/helpers/deserialize"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import makeConsultationChatNamespace from "$/namespace_makers/consultation_chat"
import DynamicGatedRedirector from "!/middlewares/miscellaneous/dynamic_gated_redirector"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	get postValidationMiddlewares(): Middleware[] {
		return [
			new DynamicGatedRedirector(async(request: AuthenticatedRequest) => {
				const user = deserialize(request.user) as DeserializedUserProfile
				const manager = new Manager(request.transaction, request.cache)

				const consultations = await manager.list({
					"filter": {
						"existence": "exists",
						"user": Number(user.data.id)
					},
					"page": {
						"limit": 1,
						"offset": 0
					},
					"sort": [ "-updatedAt" ]
				}) as ConsultationListDocument

				if (consultations.data.length === 0) {
					return null
				}

				return {
					"location": makeConsultationChatNamespace(consultations.data[0].id)
				}
			})
		]
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
