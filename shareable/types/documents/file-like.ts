import type { Format as BaseFormat, Attributes } from "$/types/documents/base"

type Format = BaseFormat|"raw"

export interface FileLikeAttributes<T extends Format = "serialized">
extends Attributes<T extends "raw" ? "serialized": T> {
	fileContents: T extends "raw" ? Buffer : undefined
}

export interface FileLikeResourceLinks<T extends Format = "serialized"> {
	links: T extends "raw" ? undefined : {
		self: string
	}
}
