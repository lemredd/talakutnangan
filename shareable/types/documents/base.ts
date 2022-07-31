import type { Serializable } from "$/types/database"
import type { UnitError, GeneralObject } from "$/types/server"

export interface PrimaryData extends Serializable {}

export interface ResourceIdentifier extends PrimaryData {
	type: string,
	id: number
}

export interface Attributes extends GeneralObject {}

export type Resource<T extends ResourceIdentifier> = T & {
	attributes: Attributes
}

export type DeserializedResource<T extends ResourceIdentifier, U extends Attributes> =
	& T
	& U

export interface DataDocument<T extends PrimaryData|PrimaryData[]> extends Serializable {
	data: T
}

export interface CompleteDataDocument<
	T extends ResourceIdentifier,
	U extends Resource<T>
> extends DataDocument<U> {}

export interface CompleteDataListDocument<
	T extends ResourceIdentifier,
	U extends Resource<T>
> extends DataDocument<U[]> {}

export interface DeserializedCompleteDataDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends DeserializedResource<T, U>
> extends DataDocument<V> {}

export interface DeserializedCompleteDataListDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends DeserializedResource<T, U>
> extends DataDocument<V[]> {}

export interface ErrorDocument {
	errors: UnitError[]
}
