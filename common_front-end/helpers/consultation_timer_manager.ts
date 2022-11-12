import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	TimerListeners,
	ConsultationEventNames,
	ConsultationEventListeners
} from "$@/types/dependent"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"
import convertTimeToMilliseconds from "$/time/convert_time_to_milliseconds"
import calculateMillisecondDifference from "$/time/calculate_millisecond_difference"

/**
 * Manages the timers of different consultations.
 *
 * It must be manually ticked to reduce the number running timers.
 */
export default class ConsultationTimerManager extends RequestEnvironment {
	static MAX_EXPIRATION_TIME: number = convertTimeToMilliseconds("00:05:00")
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
			differenceFromNow = Math.max(convertTimeToMilliseconds("00:00:01"), differenceFromNow)
			ConsultationTimerManager.listeners.push({
				"consultation": resource,
				"consultationListeners": {
					"consumedTime": [] as ConsultationEventListeners["consumedTime"][],
					"finish": [] as ConsultationEventListeners["finish"][],
					"restartTime": [] as ConsultationEventListeners["restartTime"][]
				},
				"remainingMillisecondsBeforeInactivity": this.isOnIntegration
					? Math.max(
						differenceFromNow,
						ConsultationTimerManager.MAX_EXPIRATION_TIME
					)
					: differenceFromNow
			})

			foundIndex = ConsultationTimerManager.listeners.length - 1
		}

		const { consultationListeners } = ConsultationTimerManager.listeners[foundIndex]
		if (consultationListeners[eventName].indexOf(listener) === -1) {
			consultationListeners[eventName].push(listener)
		}
	}

	static unlistenConsultationTimeEvent<T extends ConsultationEventNames>(
		resource: DeserializedConsultationResource,
		eventName: T,
		listener: ConsultationEventListeners[T]
	): void {
		const resourceID = resource.id

		if (resource.finishedAt === null) {
			throw new Error("Consultation should have finished before it can be managed.")
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
				ConsultationTimerManager.forceFinish(consultation)
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

	static restartTimerFor(resource: DeserializedConsultationResource): void {
		const resourceID = resource.id

		if (resource.startedAt === null) {
			throw new Error("Consultation should have started before it can be managed.")
		}

		const foundIndex = ConsultationTimerManager.listeners.findIndex(existingListener => {
			const doesMatchResource = existingListener.consultation.id === resourceID
			return doesMatchResource
		})

		if (foundIndex === -1) return

		const listener = ConsultationTimerManager.listeners[foundIndex]
		listener.consultation = resource
		listener.remainingMillisecondsBeforeInactivity = ConsultationTimerManager.MAX_EXPIRATION_TIME
		listener.consultationListeners.restartTime.forEach(consultationListener => {
			consultationListener(resource)
		})
	}

	static travelTimeTo(resource: DeserializedConsultationResource, remainingMilliseconds: number)
	: void {
		const resourceID = resource.id

		if (resource.startedAt === null) {
			throw new Error("Consultation should have started before it can be managed.")
		}

		const foundIndex = ConsultationTimerManager.listeners.findIndex(existingListener => {
			const doesMatchResource = existingListener.consultation.id === resourceID
			return doesMatchResource
		})

		if (foundIndex === -1) return

		const listener = ConsultationTimerManager.listeners[foundIndex]
		listener.consultation = resource
		listener.remainingMillisecondsBeforeInactivity = remainingMilliseconds
		listener.consultationListeners.consumedTime.forEach(consultationListener => {
			consultationListener(resource, listener.remainingMillisecondsBeforeInactivity)
		})
	}

	static forceFinish(resource: DeserializedConsultationResource): void {
		const resourceID = resource.id

		if (resource.startedAt === null) {
			throw new Error("Consultation should have started before it can be managed.")
		}

		const foundIndex = ConsultationTimerManager.listeners.findIndex(existingListener => {
			const doesMatchResource = existingListener.consultation.id === resourceID
			return doesMatchResource
		})

		if (foundIndex === -1) return

		const listener = ConsultationTimerManager.listeners[foundIndex]
		listener.consultation = resource
		listener.remainingMillisecondsBeforeInactivity = 0
		const finishListeners = [ ...listener.consultationListeners.finish ]

		listener.consultationListeners.consumedTime = []
		listener.consultationListeners.restartTime = []
		listener.consultationListeners.finish = []
		for (const sublistener of finishListeners) {
			sublistener(resource)
		}
	}
}
