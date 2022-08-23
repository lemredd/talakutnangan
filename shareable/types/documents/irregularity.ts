import type { Serializable } from "$/types/general"
import type { Format, Completeness, MetaDocument } from "$/types/documents/base"

/**
 * Some documents have raw formats which cannot be serialized.
 */
export type RawableFormat = Format|"raw"

/**
 * Treats irregular formats as "serialized"
 */
export type FormatRegulator<T extends RawableFormat = "serialized">
= T extends "raw" ? "serialized": T

/**
 * Some documents have different properties depending if they are attached or not.
 */
export type AttachableCompleteness = Completeness|"attached"

/**
 * Treats irregular completeness as "read"
 */
export type CompletenessRegulator<T extends AttachableCompleteness = "read">
= T extends "attached" ? "read" : T

/**
 * Eliminates other completeness variants which are not readable.
 */
export type ReadableCompleteness = Exclude<AttachableCompleteness, "update"|"create">

/**
 * Some documents have also the number of users related to them.
 */
export type PaginatedDocument<T extends AttachableCompleteness>
= T extends "read" ? MetaDocument<{
	userCount: number
}> : Serializable
