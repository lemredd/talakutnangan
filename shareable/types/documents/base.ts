import type { Serializable } from "$/types/database"
import type { UnitError, GeneralObject } from "$/types/server"

export interface PrimaryData extends Serializable {}

export interface ResourceIdentifierObject extends PrimaryData {
	type: string,
	id: number
}

export interface Attributes extends GeneralObject {}

export type ResourceObject<T extends ResourceIdentifierObject> = T & {
	attributes: Attributes
}

export type DserializedResourceObject<T extends ResourceIdentifierObject, U extends Attributes> =
	& T
	& U

export interface CompleteDataDocument<
	U extends ResourceIdentifierObject,
	T extends ResourceObject<U>
> extends Serializable {
	data: T
}

export interface CompleteDataListDocument<
	U extends ResourceIdentifierObject,
	T extends ResourceObject<U>
> extends Serializable {
	data: T[]
}

export interface ErrorDocument {
	errors: UnitError[]
}
