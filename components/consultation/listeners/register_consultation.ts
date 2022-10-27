import { Ref } from "vue"

import type {
	ConsultationResource,
	DeserializedConsultationDocument,
	DeserializedConsultationResource,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"

import Socket from "$@/external/socket"
import deserialize from "$/object/deserialize"
import makeConsultationNamespace from "$/namespace_makers/consultation"
import makeConsultationListOfUserNamespace from "$/namespace_makers/consultation_list_of_user"

export default function(
	consultation: Ref<DeserializedConsultationResource<"consultant"|"consultantRole">>,
	consultations: Ref<DeserializedConsultationListDocument<"consultant"|"consultantRole">>,
	userID: string
) {
	function updateConsultation(updatedConsultation: ConsultationResource<"read">): void {
		const deserializedConsultation = deserialize(
			updatedConsultation
		) as DeserializedConsultationDocument<"read">

		consultation.value = {
			...consultation.value,
			...deserializedConsultation.data
		}
	}
	const consultationNamespace = makeConsultationNamespace(consultation.value.id)
	Socket.addEventListeners(consultationNamespace, {
		"update": updateConsultation
	})

	function createConsultation(newConsultation: ConsultationResource<"read">): void {
		const deserializedConsultation = deserialize(
			newConsultation
		) as DeserializedConsultationDocument<"read">

		consultations.value.data = [
			...consultations.value.data,
			deserializedConsultation.data as unknown as DeserializedConsultationResource<
			"consultant"|"consultantRole"
			>
		]
	}
	const consultationListOfUserNamespace = makeConsultationListOfUserNamespace(userID)
	Socket.addEventListeners(consultationListOfUserNamespace, {
		"create": createConsultation
	})
}
