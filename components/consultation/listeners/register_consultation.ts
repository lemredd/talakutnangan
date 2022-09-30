import { Ref } from "vue"

import type {
	ConsultationResource,
	DeserializedConsultationDocument,
	DeserializedConsultationResource
} from "$/types/documents/consultation"

import Socket from "$@/external/socket"
import deserialize from "$/object/deserialize"
import makeConsultationNamespace from "$/namespace_makers/consultation"

export default function(
	consultation: Ref<DeserializedConsultationResource<"consultant"|"consultantRole">>
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
}
