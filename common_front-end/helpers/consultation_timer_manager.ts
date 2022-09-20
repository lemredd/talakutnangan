import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	TimerListeners,
	ConsultationEventNames,
	ConsultationEventListeners
} from "$@/types/dependent"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import calculateMillisecondDifference from "$@/helpers/calculate_millisecond_difference"

/**
 * Manages the timers of different consultations.
 *
 * It must be manually ticked to reduce the number running timers.
 */
export default class ConsultationTimerManager extends RequestEnvironment {
	private static listeners: TimerListeners = []

	static listenConsultationTimeEvent<T extends ConsultationEventNames>(
		resource: DeserializedConsultationResource,
		eventName: T,
		listener: ConsultationEventListeners[T]
	): void {
		const resourceID = resource.id

		if (resource.startedAt === null) {
			throw new Error("Consultation should have started before it can be managed.")
		}

		let foundIndex = ConsultationTimerManager.listeners.findIndex(existingListener => {
			const doesMatchResource = existingListener.consultation.id === resourceID
			return doesMatchResource
		})

		if (foundIndex === -1) {
			let differenceFromNow = calculateMillisecondDifference(new Date(), resource.startedAt)
			const extraMilliseconds = differenceFromNow % convertTimeToMilliseconds("00:00:01")
			differenceFromNow -= extraMilliseconds
			ConsultationTimerManager.listeners.push({
				"consultation": resource,
				"consultationListeners": {
					"consumedTime": [] as ConsultationEventListeners["consumedTime"][],
					"finish": [] as ConsultationEventListeners["finish"][]
				},
				"remainingMillisecondsBeforeInactivity": differenceFromNow
			})

			foundIndex = ConsultationTimerManager.listeners.length - 1
		}

		ConsultationTimerManager.listeners[foundIndex].consultationListeners[eventName].push(listener)
	}

	static unlistenConsultationTimeEvent<T extends ConsultationEventNames>(
		resource: DeserializedConsultationResource,
		eventName: T,
		listener: ConsultationEventListeners[T]
	): void {
		const resourceID = resource.id

		if (resource.finishedAt === null) {
			throw new Error("Consultation should have started before it can be managed.")
		}

		const foundListenerIndex = ConsultationTimerManager.listeners.findIndex(existingListener => {
			const doesMatchResource = existingListener.consultation.id === resourceID
			return doesMatchResource
		})

		if (foundListenerIndex === -1) {
			return
		}

		const listeners = ConsultationTimerManager
		.listeners[foundListenerIndex]
		.consultationListeners[eventName]
		.filter(eventListener => listener !== eventListener)

		ConsultationTimerManager.listeners[foundListenerIndex].consultationListeners[eventName] = []
		ConsultationTimerManager.listeners[foundListenerIndex].consultationListeners[eventName].push(
			...listeners
		)
	}

	static nextInterval(): void {
		ConsultationTimerManager.listeners.forEach(listener => {
			const { consultation } = listener
			listener.remainingMillisecondsBeforeInactivity -= convertTimeToMilliseconds("00:00:01")
			if (listener.remainingMillisecondsBeforeInactivity > 0) {
				listener.consultationListeners.consumedTime.forEach(consultationListener => {
					consultationListener(consultation, listener.remainingMillisecondsBeforeInactivity)
				})
			} else {
				listener.consultationListeners.finish.forEach(consultationListener => {
					consultationListener(consultation)
				})
			}
		})
	}

	static clearAllListeners(): void {
		Stub.runConditionally(
			() => {
				throw new Error("It is impossible to clear all consultation time listeners forcefully.")
			},
			() => {
				ConsultationTimerManager.listeners = []
				return [ {} as unknown as void, null ]
			}
		)
	}
}
