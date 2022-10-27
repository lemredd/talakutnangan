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

export interface DateTimeRange {
	beginDateTime: Date,
	endDateTime: Date
}

interface WeeklySummedTimeProperties extends DateTimeRange, SummedTimeMetaProperties {}

interface WeeklySummedTimeMetaCollection extends Serializable {
	weeklyTimeSums: WeeklySummedTimeProperties[]
}

export type WeeklySummedTimeDocument = MetaDocument<WeeklySummedTimeMetaCollection>

interface ConsolidatedSummedTimeProperties extends DateTimeRange, BasicSummedTimeMetaProperties {
	consultationIDs: string[]
	userIDs: string[]
}

interface ConsolidatedSummedTimeMetaCollection extends Serializable {
	rawConsolidatedTimeSums: ConsolidatedSummedTimeProperties[]
}

export type ConsolidatedSummedTimeDocument = MetaDocument<ConsolidatedSummedTimeMetaCollection>
