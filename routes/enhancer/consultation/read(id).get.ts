import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { ConsultationDocument, ConsultationListDocument } from "$/types/documents/consultation"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import Middleware from "!/bases/middleware"
import Manager from "%/managers/consultation"
import URLMaker from "$!/singletons/url_maker"
import deserialize from "$/helpers/deserialize"
import present from "!/validators/manager/present"
import makeUnique from "$/helpers/array/make_unique"
import ChatMessageManager from "%/managers/chat_message"
import IDParameterValidator from "!/validations/id_parameter"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import ChatMessageActivityManager from "%/managers/chat_message_activity"
import DynamicGatedRedirector from "!/middlewares/miscellaneous/dynamic_gated_redirector"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return CommonMiddlewareList.consultationParticipantsOnlyPolicy
	}

	get validations(): Validation[] {
		return [
			// TODO: Allow adding other rules
			new IDParameterValidator([
				[ "id", Manager, present ]
			])
		]
	}

	get postValidationMiddlewares(): Middleware[] {
		return [
			new DynamicGatedRedirector(async(request: AuthenticatedRequest) => {
				const { id } = request.params
				const manager = new Manager(request.transaction, request.cache)

				const consultation = await manager.findWithID(Number(id))

				if (consultation.data === null) {
					return {
						"location": URLMaker.makeURLFromPath("/consultation")
					}
				}

				return null
			})
		]
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable> {
		const user = deserialize(request.user) as DeserializedUserProfile

		const { id } = request.params
		const manager = new Manager(request.transaction, request.cache)

		const consultations = await manager.list({
			"filter": {
				"consultationScheduleRange": "*",
				"existence": "exists",
				"user": Number(user.data.id)
			},
			"page": {
				"limit": 1,
				"offset": 0
			},
			"sort": [ "-updatedAt" ]
		}) as ConsultationListDocument
		const consultation = await manager.findWithID(Number(id)) as ConsultationDocument

		const consultationIDs = consultations.data.map(consultation => Number(consultation.id))
		consultationIDs.push(Number(consultation.data.id))

		const chatMessageActivityManager = new ChatMessageActivityManager(
			request.transaction,
			request.cache
		)
		const chatMessageActivities = await chatMessageActivityManager.list({
			"filter": {
				"consultationIDs": makeUnique(consultationIDs),
				"existence": "*"
			},
			"page": {
				"limit": 10,
				"offset": 0
			},
			"sort": [ "id" ]
		})

		return {
			consultation,
			consultations,
			chatMessageActivities
		}
	}
}
