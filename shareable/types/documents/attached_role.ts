/**
 * @description This module should not be used in production code. It only for testing purposes.
 */
import type { DeserializedRoleDocument, RoleIdentifierDocument } from "$/types/documents/role"
import type { DeserializedUserDocument, UserIdentifierDocument } from "$/types/documents/user"
import type {
	Completeness,
	Format,

	Resource,
	Attributes,
	ResourceDocument,
	ResourceIdentifier,

	DeriveRelationships,
	DeriveRelationshipNames,
	GeneralRelationshipData,
	DeriveDeserializedRelationships,
	PartialOrPickDeserializedRelationship,

	DeserializedResource,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"

export interface AttachedRoleResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "attached_role"
}

export type AttachedRoleAttributes<T extends Format = "serialized"> = Attributes<T>

interface AttachedRoleRelationshipData<unusedT extends Completeness = "read">
extends GeneralRelationshipData {
	user: {
		serialized: UserIdentifierDocument,
		deserialized: DeserializedUserDocument,
	},
	role: {
		serialized: RoleIdentifierDocument,
		deserialized: DeserializedRoleDocument
	}
}

export type AttachedRoleRelationshipNames
= DeriveRelationshipNames<AttachedRoleRelationshipData>

export type AttachedRoleRelationships<T extends Completeness = "read">
= DeriveRelationships<AttachedRoleRelationshipData<T>>

export type DeserializedAttachedRoleRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<AttachedRoleRelationshipData<T>>

export type AttachedRoleResource<T extends Completeness = "read"> = Resource<
	T,
	AttachedRoleResourceIdentifier<T>,
	AttachedRoleAttributes<"serialized">
>

export type DeserializedAttachedRoleResource<
T extends AttachedRoleRelationshipNames|undefined = undefined
> = DeserializedResource<
	AttachedRoleResourceIdentifier<"read">,
	AttachedRoleAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	AttachedRoleRelationshipData<"read">,
	DeserializedAttachedRoleRelationships<"read">,
	AttachedRoleRelationshipNames,
	T extends AttachedRoleRelationshipNames ? true : false,
	T extends AttachedRoleRelationshipNames ? T : AttachedRoleRelationshipNames
>

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

export type DeserializedAttachedRoleDocument<
	T extends AttachedRoleRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	AttachedRoleResourceIdentifier<"read">,
	AttachedRoleAttributes<"deserialized">,
	DeserializedAttachedRoleResource<T>
>

export type DeserializedAttachedRoleListDocument<
	T extends AttachedRoleRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	AttachedRoleResourceIdentifier<"read">,
	AttachedRoleAttributes<"deserialized">,
	DeserializedAttachedRoleResource<T>
>
