import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type {
	ConsultationDocument,
	ConsultationListDocument
} from "$/types/documents/consultation"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import makeUnique from "$/array/make_unique"
import deserialize from "$/object/deserialize"
import URLMaker from "$!/singletons/url_maker"

import Manager from "%/managers/consultation"
import ChatMessageManager from "%/managers/chat_message"
import ChatMessageActivityManager from "%/managers/chat_message_activity"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import Middleware from "!/bases/middleware"
import Merger from "!/middlewares/miscellaneous/merger"
import IDParameterValidator from "!/validations/id_parameter"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import DynamicGatedRedirector from "!/middlewares/miscellaneous/dynamic_gated_redirector"

import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import BelongsToCurrentUserPolicy from "!/policies/belongs_to_current_user"

import present from "!/validators/manager/present"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new Merger([
			CommonMiddlewareList.consultationParticipantsOnlyPolicy,
			new BelongsToCurrentUserPolicy(Manager)
		]) as unknown as Policy
	}

	get validations(): Validation[] {
		return [
			new IDParameterValidator([
				[ "id", Manager, present ]
			])
		]
	}

	get postValidationMiddlewares(): Middleware[] {
		return [
			new DynamicGatedRedirector(async(request: AuthenticatedRequest) => {
				const { id } = request.params
				const manager = new Manager(request)

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

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Consultation Form | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable> {
		const NORMAL_MAXIMUM_CONSULTATION_COUNT = 10
		const user = deserialize(request.user) as DeserializedUserProfile

		const { id } = request.params
		const manager = new Manager(request)

		const consultations = await manager.list({
			"filter": {
				"consultationScheduleRange": "*",
				"existence": "exists",
				"user": Number(user.data.id)
			},
			"page": {
				"limit": NORMAL_MAXIMUM_CONSULTATION_COUNT,
				"offset": 0
			},
			"sort": [ "-updatedAt" ]
		}) as ConsultationListDocument
		const consultation = await manager.findWithID(Number(id)) as ConsultationDocument

		const consultationIDs = consultations.data.map(
			consultationResource => Number(consultationResource.id)
		)
		const allConsultationIDs = makeUnique([
			Number(consultation.data.id),
			...consultationIDs
		])

		const INCLUSIVE_CONSULTATION_COUNT = allConsultationIDs.length
		const MAXIMUM_STUDENT_COUNT = 5
		const MAXIMUM_REACHABLE_EMPLOYEE_COUNT = 1
		const MAXIMUM_PARTICIPANT_COUNT = MAXIMUM_STUDENT_COUNT + MAXIMUM_REACHABLE_EMPLOYEE_COUNT

		const chatMessageActivityManager = new ChatMessageActivityManager(request)
		const chatMessageActivities = await chatMessageActivityManager.list({
			"filter": {
				"consultationIDs": [ Number(id) ],
				"existence": "*"
			},
			"page": {
				"limit": INCLUSIVE_CONSULTATION_COUNT * MAXIMUM_PARTICIPANT_COUNT,
				"offset": 0
			},
			"sort": [ "id" ]
		})

		const chatMessageManager = new ChatMessageManager(request)
		const chatMessages = await chatMessageManager.list({
			"filter": {
				"chatMessageKinds": "*",
				"consultationIDs": [ Number(consultation.data.id) ],
				"existence": "exists",
				"previewMessageOnly": false
			},
			"page": {
				"limit": DEFAULT_LIST_LIMIT,
				"offset": 0
			},
			"sort": [ "createdAt" ]
		})

		return {
			chatMessageActivities,
			chatMessages,
			consultation
		}
	}
}
