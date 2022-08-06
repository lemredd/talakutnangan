import type { Attributes } from "$/types/documents/base"

export interface FileLikeAttributes<T = string> extends Attributes {
	file?: T
}

export interface FileLikeResourceLinks {
	links?: {
		self: string
	}
}
