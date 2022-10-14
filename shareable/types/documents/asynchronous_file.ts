import type { RawableFormat, FormatRegulator } from "$/types/documents/irregularity"
import type {
	AsynchronousLikeRelationshipNames,
	AsynchronousLikeRelationships,
	DeserializedAsynchronousLikeRelationships,
	AsynchronousLikeAttributes
} from "$/types/documents/asynchronous-like"
import type { Completeness } from "$/types/documents/base"

export type AsynchronousFileRelationshipNames = AsynchronousLikeRelationshipNames

export type AsynchronousFileRelationships<T extends Completeness = "read">
= AsynchronousLikeRelationships<T>

export type DeserializedAsynchronousFileRelationships<T extends Completeness = "read">
= DeserializedAsynchronousLikeRelationships<T>

export interface AsynchronousFileAttributes<T extends RawableFormat = "serialized">
extends AsynchronousLikeAttributes<FormatRegulator<T>> {
	fileContents: (T extends "raw" ? Buffer : string)|null
}
