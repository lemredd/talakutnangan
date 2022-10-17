import type { Serializable } from "$/types/general"
import type { MetaDocument } from "$/types/documents/base"

interface SummedTimeMetaProperties extends Serializable {
	totalMillisecondsConsumed: number
}

export type SummedTimeDocument = MetaDocument<SummedTimeMetaProperties>

interface WeeklySummedTimeMetaProperties extends SummedTimeMetaProperties {
	beginDateTime: Date,
	endDateTime: Date
}

export type WeeklySummedTimeDocument = MetaDocument<WeeklySummedTimeMetaProperties>
