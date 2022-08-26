/**
 * @description This module should not be used in production code. It only for testing purposes.
 */
import type { DeserializedRoleDocument } from "$/types/documents/role"
import type { DeserializedUserDocument } from "$/types/documents/user"
import type {
	Completeness,
	Format,
	Resource,
	Attributes,
	ResourceDocument,
	ResourceIdentifier,
	DeserializedResource,
	ResourceListDocument,
	DeserializedRelationships,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface AttachedRoleResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "attached_role"
}

export type AttachedRoleAttributes<T extends Format = "serialized"> = Attributes<T>

type RawDeserializedAttachedRoleRelationships = [
	[ "user", DeserializedUserDocument ],
	[ "role", DeserializedRoleDocument ]
]

export type DeserializedAttachedRoleelationships = DeserializedRelationships & {
	[Property in RawDeserializedAttachedRoleRelationships[number][0]]
	: RawDeserializedAttachedRoleRelationships[number][1]
}

export type AttachedRoleResource<T extends Completeness = "read"> = Resource<
	T,
	AttachedRoleResourceIdentifier<T>,
	AttachedRoleAttributes<"serialized">
>

export type DeserializedAttachedRoleResource = DeserializedResource<
	AttachedRoleResourceIdentifier<"read">,
	AttachedRoleAttributes<"deserialized">
> & DeserializedAttachedRoleelationships

export type AttachedRoleDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	AttachedRoleResourceIdentifier<T>,
	AttachedRoleAttributes<"serialized">,
	AttachedRoleResource<T>
>

export type AttachedRoleListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	AttachedRoleResourceIdentifier<T>,
	AttachedRoleAttributes<"serialized">,
	AttachedRoleResource<T>
>

export type DeserializedAttachedRoleDocument = DeserializedResourceDocument<
	AttachedRoleResourceIdentifier<"read">,
	AttachedRoleAttributes<"deserialized">,
	DeserializedAttachedRoleResource
>

export type DeserializedAttachedRoleListDocument = DeserializedResourceListDocument<
	AttachedRoleResourceIdentifier<"read">,
	AttachedRoleAttributes<"deserialized">,
	DeserializedAttachedRoleResource
>
