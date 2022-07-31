import type { Serializable } from "$/types/database"
import type { UnitError, GeneralObject } from "$/types/server"

export interface PrimaryData extends Serializable {}

export interface ResourceIdentifier extends PrimaryData {
	type: string,
	id: number
}

export interface Attributes extends GeneralObject {}

export type Resource<T extends ResourceIdentifier, U extends Attributes> = T & {
	attributes: U
}

export type DeserializedResource<T extends ResourceIdentifier, U extends Attributes> =
	& T
	& U

export interface DataDocument<T extends PrimaryData|PrimaryData[]> extends Serializable {
	data: T
}

export interface ResourceDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends Resource<T, U>
> extends DataDocument<V> {}

export interface ResourceListDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends Resource<T, U>
> extends DataDocument<V[]> {}

export interface DeserializedResourceDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends DeserializedResource<T, U>
> extends DataDocument<V> {}

export interface DeserializedResourceListDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends DeserializedResource<T, U>
> extends DataDocument<V[]> {}

export interface ErrorDocument {
	errors: UnitError[]
}
