import type { GeneralObject } from "$/types/general"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"

export type SocketListeners = GeneralObject<(...parameters: any[]) => void>

export type ConsultationEventListeners = {
	"finish": (consultation: DeserializedConsultationResource) => Promise<boolean>,
	"consumedTime": (
		consultation: DeserializedConsultationResource,
		remainingMillisecondsBeforeInactivity: number
	) => Promise<void>
}

export type ConsultationEventNames = keyof ConsultationEventListeners

interface TimerListener {
	"consultation": DeserializedConsultationResource,
	"remainingMillisecondsBeforeInactivity": number,
	"consultationListeners": {
		[Property in keyof ConsultationEventListeners]: ConsultationEventListeners[Property][]
	}
}

export type TimerListeners = TimerListener[]
