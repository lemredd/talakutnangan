import type { Attributes } from "$/types/documents/base"
import type { RawableFormat, FormatRegulator } from "$/types/documents/irregularity"

export interface FileLikeAttributes<T extends RawableFormat = "serialized">
extends Attributes<FormatRegulator<T>> {
	fileContents: T extends "raw" ? Buffer : string
}
