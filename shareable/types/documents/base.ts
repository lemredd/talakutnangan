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
	T extends ResourceIdentifierObject,
	U extends ResourceObject<T>
> extends Serializable {
	data: U
}

export interface CompleteDataListDocument<
	T extends ResourceIdentifierObject,
	U extends ResourceObject<T>
> extends Serializable {
	data: U[]
}

export interface DeserializedCompleteDataDocument<
	T extends ResourceIdentifierObject,
	U extends Attributes,
	V extends DserializedResourceObject<T, U>
> extends Serializable {
	data: V
}

export interface DeserializedCompleteDataListDocument<
	T extends ResourceIdentifierObject,
	U extends Attributes,
	V extends DserializedResourceObject<T, U>
> extends Serializable {
	data: V[]
}

export interface ErrorDocument {
	errors: UnitError[]
}
