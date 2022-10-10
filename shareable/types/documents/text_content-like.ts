import type { Format, Attributes } from "$/types/documents/base"

export interface TextContentLikeAttributes<T extends Format = "serialized"> extends Attributes<T> {
	content: string,
	deletedAt: (T extends "serialized" ? string : Date)|null
}
