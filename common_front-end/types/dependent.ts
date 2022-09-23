import type { GeneralObject } from "$/types/general"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"

export type SocketListeners = GeneralObject<(...parameters: any[]) => void>

export type ConsultationEventListeners = {
	"consumedTime": (
		consultation: DeserializedConsultationResource,
		remainingMillisecondsBeforeInactivity: number
	) => void,
	"finish": (consultation: DeserializedConsultationResource) => void,
	"restartTime": (consultation: DeserializedConsultationResource) => void
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
