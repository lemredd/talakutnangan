import type { Format as BaseFormat, Attributes } from "$/types/documents/base"

export type Format = BaseFormat|"raw"

export interface FileLikeAttributes<T extends Format = "serialized">
extends Attributes<T extends "raw" ? "serialized": T> {
	fileContents: T extends "raw" ? Buffer : string
}
