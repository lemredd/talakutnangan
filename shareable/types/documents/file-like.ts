import type { Attributes } from "$/types/documents/base"

export interface FileLikeAttributes<T = string> extends Attributes {
	fileContents?: T
}

export interface FileLikeResourceLinks {
	links?: {
		self: string
	}
}
