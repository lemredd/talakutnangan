import type { Serializable } from "$/types/general"
import type { MetaDocument } from "$/types/documents/base"

interface SummedTimeMetaProperties extends Serializable {
	totalMillisecondsConsumed: number
}

export type SummedTimeDocument = MetaDocument<SummedTimeMetaProperties>
