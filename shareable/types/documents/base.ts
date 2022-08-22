import type { UnitError } from "$/types/server"
import type { GeneralObject, Serializable } from "$/types/general"

export type PrimaryData = Serializable

export type Completeness = "create"|"update"|"read"

export interface ResourceIdentifier<T extends Completeness = "read"> extends PrimaryData {
	type: string,
	id: T extends "create"? undefined : string
}

export type Format = "serialized"|"deserialized"

export type Attributes<unusedT extends Format = "serialized"> = GeneralObject

export type Resource<
	T extends Completeness,
	U extends Format,
	V extends ResourceIdentifier<T>,
	W extends Attributes<U>
> = V & {
	attributes: W
}

type RelationshipData<T extends ResourceIdentifier|ResourceIdentifier[]> = Record<string, T>

export interface Relationships<T extends RelationshipData<any>> extends Serializable {
	relationships: {
		[Property in T[string][0]]: {
			data: T[string][1]
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
