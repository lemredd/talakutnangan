import type { UnitError } from "$/types/server"
import type { GeneralObject, Serializable } from "$/types/general"

export type PrimaryData = Serializable

export interface ResourceIdentifier extends PrimaryData {
	type: string,
	id: string
}

export type Format = "serialized"|"deserialized"

export type Attributes<unusedT extends Format = "serialized"> = GeneralObject

export type Resource<
	U extends ResourceIdentifier,
	V extends Attributes> = U & {
	attributes: V
}

type RelationshipData<T extends ResourceIdentifier|ResourceIdentifier[]> = [ string, T ]

export interface Relationships<
	T extends boolean,
	U extends RelationshipData<any>[]
> extends Serializable {
	relationships: T extends false ? undefined : {
		[Property in U[number][0]]: {
			data: U[number][1]
		}
	}
}

export type DeserializedResource<
	U extends ResourceIdentifier,
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
	U extends ResourceIdentifier,
	V extends Attributes,
	W extends Resource<U, V>
> = DataDocument<W>

export type RawResourceDocument<
	U extends ResourceIdentifier,
	V extends Attributes,
	W extends Resource<U, V>
> = DataDocument<Pick<W, "type" | "attributes" | "relationships" | "links" | "meta">>

export interface ResourceListDocument<
	U extends ResourceIdentifier,
	V extends Attributes,
	W extends Resource<U, V>
> extends DataDocument<W[]>, Partial<MetaDocument<ResourceCount>> {}

export type DeserializedResourceDocument<
	U extends ResourceIdentifier,
	V extends Attributes,
	W extends DeserializedResource<U, V>
> = DataDocument<W>

export interface DeserializedResourceListDocument<
	U extends ResourceIdentifier,
	V extends Attributes,
	W extends DeserializedResource<U, V>
> extends DataDocument<W[]>, Partial<MetaDocument<ResourceCount>> {}

export type IdentifierDocument<U extends ResourceIdentifier>
= DataDocument<U>

export type IdentifierListDocument<U extends ResourceIdentifier>
= DataDocument<U[]>

export interface ErrorDocument {
	errors: UnitError[]
}
