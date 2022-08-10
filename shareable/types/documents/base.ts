import type { UnitError } from "$/types/server"
import type { GeneralObject, Serializable } from "$/types/general"

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

export interface MetaDocument<T extends Serializable> extends Serializable {
	meta: T
}

export interface ResourceDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends Resource<T, U>
> extends DataDocument<V> {}

export interface RawResourceDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends Resource<T, U>
> extends DataDocument<Pick<V, "type" | "attributes" | "relationships" | "links" | "meta">> {}

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

export interface IdentifierDocument<T extends ResourceIdentifier> extends DataDocument<T> {}

export interface IdentifierListDocument<T extends ResourceIdentifier> extends DataDocument<T[]> {}

export interface ErrorDocument {
	errors: UnitError[]
}
