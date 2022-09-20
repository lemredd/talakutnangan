import type { GeneralObject } from "$/types/general"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"

export type SocketListeners = GeneralObject<(...parameters: any[]) => void>

type ConsultationListener<T> = (consultation: DeserializedConsultationResource) => Promise<T>

export type ConsultationEventListeners = {
	"finish": ConsultationListener<boolean>,
	"consumedTime": ConsultationListener<void>
}

export type ConsultationEventNames = keyof ConsultationEventListeners

interface TimerListener {
	"consultation": DeserializedConsultationResource,
	"remainingMillisecondsBeforeInactivity": number,
	"listeners": {
		[Property in keyof ConsultationEventListeners]: ConsultationEventListeners[Property][]
	}
}

export type TimerListeners = TimerListener[]
