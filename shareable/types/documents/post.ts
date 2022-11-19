import type { Serializable } from "$/types/general"
import type { TextContentLikeAttributes } from "$/types/documents/text_content-like"
import type {
	RoleIdentifierDocument,
	DeserializedRoleDocument
} from "$/types/documents/role"
import type {
	UserIdentifierDocument,
	DeserializedUserDocument
} from "$/types/documents/user"
import type {
	DepartmentIdentifierDocument,
	DeserializedDepartmentDocument
} from "$/types/documents/department"
import type {
	TagIdentifierListDocument,
	DeserializedTagListDocument
} from "$/types/documents/tag"
import type {
	PostAttachmentIdentifierListDocument,
	DeserializedPostAttachmentListDocument
} from "$/types/documents/post_attachment"
import type {
	Completeness,
	Format,

	Resource,
	ResourceIdentifier,
	DeserializedResource,

	DeriveRelationships,
	DeriveRelationshipNames,
	GeneralRelationshipData,
	DeriveDeserializedRelationships,
	PartialOrPickDeserializedRelationship,

	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,

	IdentifierDocument,
	IdentifierListDocument,

	MetaDocument
} from "$/types/documents/base"

export type PostResourceIdentifier<T extends Completeness = "read"> = ResourceIdentifier<T> & {
	type: "post"
} & Partial<MetaDocument<{
	"commentCount": number
}>>

export type PostAttributes<T extends Format = "serialized"> = TextContentLikeAttributes<T> & {
	"createdAt": T extends "serialized" ? string : Date,
	"updatedAt": T extends "serialized" ? string : Date
}

interface PostRelationshipData<T extends Completeness = "read">
extends GeneralRelationshipData {
	department: {
		serialized: T extends "create"
			? DepartmentIdentifierDocument<"attached">|undefined
			: T extends "update"
				? undefined
				: DepartmentIdentifierDocument<"attached">,
		deserialized: DeserializedDepartmentDocument<"attached">
	},
	poster: {
		serialized: UserIdentifierDocument,
		deserialized: DeserializedUserDocument
	},
	posterRole: {
		serialized: T extends "create"|"update"
			? RoleIdentifierDocument<"attached">
			: RoleIdentifierDocument,
		deserialized: DeserializedRoleDocument<"attached">
	},
	postAttachments: {
		"serialized": T extends "create"|"update"
			? PostAttachmentIdentifierListDocument|undefined
			: PostAttachmentIdentifierListDocument,
		"deserialized": DeserializedPostAttachmentListDocument
	},
	tags: {
		"serialized": T extends "create"|"update"
			? TagIdentifierListDocument|undefined
			: TagIdentifierListDocument,
		"deserialized": DeserializedTagListDocument
	}
}

export type PostRelationshipNames = DeriveRelationshipNames<PostRelationshipData>

export type PostRelationships<T extends Completeness = "read">
= DeriveRelationships<PostRelationshipData<T>>

export type DeserializedPostRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<PostRelationshipData<T>>

export type PostResource<T extends Completeness = "read">
= Resource<
	T,
	PostResourceIdentifier<T>,
	PostAttributes
> & (
	T extends "create"
		? PostRelationships<T>
		: Serializable
)

export type DeserializedPostResource<
	T extends PostRelationshipNames|undefined = undefined
> = DeserializedResource<
	PostResourceIdentifier<"read">,
	PostAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	PostRelationshipData<"read">,
	DeserializedPostRelationships<"read">,
	PostRelationshipNames,
	T extends PostRelationshipNames ? true : false,
	T extends PostRelationshipNames ? T : PostRelationshipNames
>

export type PostDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	PostResourceIdentifier<T>,
	PostAttributes,
	PostResource<T>
>

export type PostListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	PostResourceIdentifier<T>,
	PostAttributes,
	PostResource<T>
>

export type DeserializedPostDocument<
	T extends PostRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	PostResourceIdentifier<"read">,
	PostAttributes<"deserialized">,
	DeserializedPostResource<T>
>

export type DeserializedPostListDocument<
	T extends PostRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	PostResourceIdentifier<"read">,
	PostAttributes<"deserialized">,
	DeserializedPostResource<T>
>

export type PostIdentifierDocument
= IdentifierDocument<PostResourceIdentifier<"read">>

export type PostIdentifierListDocument
= IdentifierListDocument<PostResourceIdentifier<"read">>
