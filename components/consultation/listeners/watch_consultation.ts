import { Ref, WatchEffect, watch } from "vue"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"

export default function(
	consultation: Ref<DeserializedConsultationResource<"consultant"|"consultantRole">>,
	registerListeners: (
		newConsultation: DeserializedConsultationResource<"consultant"|"consultantRole">
	) => void,
	finishConsultation: (newConsultation: DeserializedConsultationResource) => void
): WatchEffect {
	const startWatcher = watch(consultation, (newConsultation, oldConsultation) => {
		if (oldConsultation.startedAt === null && newConsultation.startedAt instanceof Date) {
			registerListeners(newConsultation)

			const finishWatcher = watch(consultation, (
				newFinishedConsultation,
				oldUnfinishedConsultation
			) => {
				if (
					oldUnfinishedConsultation.finishedAt === null
					&& newFinishedConsultation.finishedAt instanceof Date
				) {
					ConsultationTimerManager.forceFinish(newFinishedConsultation)
					ConsultationTimerManager.unlistenConsultationTimeEvent(
						newFinishedConsultation,
						"finish",
						finishConsultation
					)
					finishWatcher()
				}
			})

			startWatcher()
		}
	}, { "deep": true })

	return startWatcher
}
