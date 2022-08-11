import type { UnitError } from "$/types/server"
import type { GeneralObject, Serializable } from "$/types/general"

export type PrimaryData = Serializable

export interface ResourceIdentifier<T extends string|number = string> extends PrimaryData {
	type: string,
	id: T
}

export type Attributes = GeneralObject

export type Resource<T extends ResourceIdentifier, U extends Attributes> = T & {
	attributes: U
}

export type DeserializedResource<T extends ResourceIdentifier<number>, U extends Attributes> =
	& T
	& U

export interface DataDocument<T extends PrimaryData|PrimaryData[]> extends Serializable {
	data: T
}

export interface MetaDocument<T extends Serializable> extends Serializable {
	meta: T
}

export type ResourceDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends Resource<T, U>
> = DataDocument<V>

export type RawResourceDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends Resource<T, U>
> = DataDocument<Pick<V, "type" | "attributes" | "relationships" | "links" | "meta">>

export type ResourceListDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends Resource<T, U>
> = DataDocument<V[]>

export type DeserializedResourceDocument<
	T extends ResourceIdentifier<number>,
	U extends Attributes,
	V extends DeserializedResource<T, U>
> = DataDocument<V>

export type DeserializedResourceListDocument<
	T extends ResourceIdentifier<number>,
	U extends Attributes,
	V extends DeserializedResource<T, U>
> = DataDocument<V[]>

export interface ErrorDocument {
	errors: UnitError[]
}
