import type { Serializable } from "$/types/general"
import type { MetaDocument } from "$/types/documents/base"
import { DeserializedConsultationListDocument } from "./consultation"

interface SummedTimeMetaProperties extends Serializable {
	totalMillisecondsConsumed: number
	consultations: DeserializedConsultationListDocument
}

export type SummedTimeDocument = MetaDocument<SummedTimeMetaProperties>

interface WeeklySummedTimeProperties extends SummedTimeMetaProperties {
	beginDateTime: Date,
	endDateTime: Date
}

interface WeeklySummedTimeMetaCollection extends Serializable {
	weeklyTimeSums: WeeklySummedTimeProperties[]
}

export type WeeklySummedTimeDocument = MetaDocument<WeeklySummedTimeMetaCollection>
