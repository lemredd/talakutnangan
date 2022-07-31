import type { Serializable } from "$/types/database"
import type { UnitError } from "$/types/server"

export interface PrimaryData extends Serializable {}

export interface ResourceIdentifierObject extends PrimaryData {
	type: string,
	id: number
}

export interface Attributes extends Serializable {}

export type ResourceObject<T extends ResourceIdentifierObject> = T & {
	attributes: Attributes
}

export type DserializedResourceObject<T extends ResourceIdentifierObject, U extends Attributes> =
	& T
	& U

export interface DataDocument<T extends PrimaryData> extends Serializable {
	data: T | T[]
}

export interface ErrorDocument {
	errors: UnitError[]
}
