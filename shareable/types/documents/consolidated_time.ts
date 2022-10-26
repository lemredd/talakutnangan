import type { Serializable } from "$/types/general"
import type { MetaDocument } from "$/types/documents/base"
import { DeserializedConsultationListDocument } from "./consultation"

interface BasicSummedTimeMetaProperties extends Serializable {
	totalMillisecondsConsumed: number
}

interface SummedTimeMetaProperties extends BasicSummedTimeMetaProperties {
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

interface ConsolidatedSummedTimeProperties extends BasicSummedTimeMetaProperties {
	beginDateTime: Date,
	endDateTime: Date
	consultationIDs: string[]
	userIDs: string[]
}

interface ConsolidatedSummedTimeMetaCollection extends Serializable {
	consolidatedTimeSums: ConsolidatedSummedTimeProperties[]
}

export type ConsolidatedSummedTimeDocument = MetaDocument<ConsolidatedSummedTimeMetaCollection>
