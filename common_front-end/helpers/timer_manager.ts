import type { DeserializedConsultationResource } from "$/types/documents/consultation"
import type {
	TimerListeners,
	ConsultationEventNames,
	ConsultationEventListeners
} from "$@/types/dependent"

import Stub from "$/singletons/stub"
import RequestEnvironment from "$/singletons/request_environment"
import calculateMillisecondDifference from "$@/helpers/calculate_millisecond_difference"

/**
 * Manages the timers of different consultations.
 *
 * It must be manually ticked to reduce the number running timers.
 */
export default class TimerManager extends RequestEnvironment {
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

		let foundIndex = TimerManager.listeners.findIndex(existingListener => {
			const doesMatchResource = existingListener.consultation.id === resourceID
			return doesMatchResource
		})

		if (foundIndex === -1) {
			const differenceFromNow = calculateMillisecondDifference(new Date(), resource.startedAt)
			TimerManager.listeners.push({
				"consultation": resource,
				"listeners": {
					"consumedTime": [] as ConsultationEventListeners["consumedTime"][],
					"finish": [] as ConsultationEventListeners["finish"][]
				},
				"remainingMillisecondsBeforeInactivity": differenceFromNow
			})

			foundIndex = TimerManager.listeners.length - 1
		}

		TimerManager.listeners[foundIndex].listeners[eventName].push(listener)
	}

	static nextInterval(): void {
		TimerManager.listeners.forEach(listener => {
			if (--listener.remainingMillisecondsBeforeInactivity > 0) {
				// Consume time
			} else {
				// Finish the consultation if permitted
			}
		})
	}

	static clearAllListeners(): void {
		Stub.runConditionally(
			() => {
				throw new Error("It is impossible to clear all consultation time listeners forcefully.")
			},
			() => {
				TimerManager.listeners = []
				return [ {} as unknown as void, null ]
			}
		)
	}
}
