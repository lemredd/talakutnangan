import type {
	TimerListeners,
	ConsultationEventNames,
	ConsultationEventListeners
} from "$@/types/dependent"

import RequestEnvironment from "$/singletons/request_environment"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"

/**
 * Manages the timers of different consultations.
 *
 * It must be manually ticked to reduce the number running timers.
 */
export default class TimerManager extends RequestEnvironment {
	private static listeners: TimerListeners = []

	static listenConsultationTimeEvent<T extends ConsultationEventNames>(
		unusedresource: DeserializedConsultationResource,
		unusedeventName: T,
		unusedlistener: ConsultationEventListeners[T]
	): void {
		//
	}

	static nextInterval(): void {
		//
	}
}
