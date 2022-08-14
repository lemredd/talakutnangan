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

export type DeserializedResource<
	T extends string|number,
	U extends ResourceIdentifier<T>,
	V extends Attributes,
> =
	& U
	& V

export interface DataDocument<T extends PrimaryData|PrimaryData[]> extends Serializable {
	data: T
}

export interface MetaDocument<T extends Serializable> extends Serializable {
	meta: T
}

export interface ResourceCount extends Serializable {
	count: number
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

export interface ResourceListDocument<
	T extends ResourceIdentifier,
	U extends Attributes,
	V extends Resource<T, U>
> extends DataDocument<V[]>, MetaDocument<ResourceCount> {}

export type DeserializedResourceDocument<
	T extends string|number,
	U extends ResourceIdentifier<T>,
	V extends Attributes,
	W extends DeserializedResource<T, U, V>
> = DataDocument<W>

export interface DeserializedResourceListDocument<
	T extends string|number,
	U extends ResourceIdentifier<T>,
	V extends Attributes,
	W extends DeserializedResource<T, U, V>
> extends DataDocument<W[]>, MetaDocument<ResourceCount> {}

export type IdentifierDocument<T extends ResourceIdentifier> = DataDocument<T>

export type IdentifierListDocument<T extends ResourceIdentifier> = DataDocument<T[]>

export interface ErrorDocument {
	errors: UnitError[]
}
