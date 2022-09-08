import type { Serializable } from "$/types/general"
import type { Attributes, MetaDocument } from "$/types/documents/base"
import type { RawableFormat, FormatRegulator } from "$/types/documents/irregularity"

export interface FileLikeAttributes<T extends RawableFormat = "serialized">
extends Attributes<FormatRegulator<T>> {
	fileContents: T extends "raw" ? Buffer : string
}

export type AttachedFile<T extends RawableFormat = "serialized">
= MetaDocument<Pick<FileLikeAttributes<T>, "fileContents"> & Serializable>
