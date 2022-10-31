import { Ref, WatchEffect, watch } from "vue"

import type { DeserializedConsultationResource } from "$/types/documents/consultation"

import ConsultationTimerManager from "$@/helpers/consultation_timer_manager"

export default function(
	consultation: Ref<DeserializedConsultationResource<"consultant"|"consultantRole">>,
	registerListeners: (
		newConsultation: DeserializedConsultationResource<"consultant"|"consultantRole">
	) => void
): WatchEffect {
	function makeFinishWatcher(): WatchEffect {
		const finishWatcher = watch(consultation, (
			newFinishedConsultation,
			oldUnfinishedConsultation
		) => {
			if (
				oldUnfinishedConsultation.finishedAt === null
				&& newFinishedConsultation.finishedAt instanceof Date
			) {
				// In case the consultation finishes from other users
				ConsultationTimerManager.forceFinish(newFinishedConsultation)
				finishWatcher()
			}
		}, { "deep": true })

		return finishWatcher
	}

	function makeStartWatcher(): WatchEffect {
		const startWatcher = watch(consultation, (newConsultation, oldConsultation) => {
			if (oldConsultation.startedAt === null && newConsultation.startedAt instanceof Date) {
				registerListeners(newConsultation)
				makeFinishWatcher()
				startWatcher()
			}
		}, { "deep": true })

		return startWatcher
	}

	if (consultation.value.startedAt === null) return makeStartWatcher()
	return makeFinishWatcher()
}
