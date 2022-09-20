import type { GeneralObject } from "$/types/general"
import type { DeserializedConsultationResource } from "$/types/documents/consultation"

export type SocketListeners = GeneralObject<(...parameters: any[]) => void>

export type ConsultationListeners = {
	"consultation": DeserializedConsultationResource,
	"listeners": {
		"finish": ((consultation: DeserializedConsultationResource) => void)[]
	}
}

interface TimerListener extends ConsultationListeners {
	"remainingMillisecondsBeforeInactivity": number
}

export type TimerListeners = TimerListener[]
