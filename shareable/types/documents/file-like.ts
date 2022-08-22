import type { Format as BaseFormat, Attributes } from "$/types/documents/base"

export type Format = BaseFormat|"raw"

export type FormatBaser<T extends Format = "serialized"> = T extends "raw" ? "serialized": T

export interface FileLikeAttributes<T extends Format = "serialized">
extends Attributes<FormatBaser<T>> {
	fileContents: T extends "raw" ? Buffer : string
}
