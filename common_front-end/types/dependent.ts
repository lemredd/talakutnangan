import type { GeneralObject } from "$/types/general"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"

export type SocketListeners = GeneralObject<(...parameters: any[]) => void>

type ConsultationListener<T> = (consultation: DeserializedConsultationResource) => Promise<T>

export type ConsultationListeners = {
	"finish": ConsultationListener<boolean>,
	"consumedTime": ConsultationListener<void>
}

interface TimerListener extends ConsultationListeners {
	"consultation": DeserializedConsultationResource,
	"remainingMillisecondsBeforeInactivity": number,
	"listeners": ConsultationListeners
}

export type TimerListeners = TimerListener[]
