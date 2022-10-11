import type { Serializable } from "$/types/general"
import type { TextContentLikeAttributes } from "$/types/documents/text_content-like"
import type {
	CommentIdentifierDocument,
	DeserializedCommentDocument
} from "$/types/documents/comment"
import type { UserIdentifierDocument, DeserializedUserDocument } from "$/types/documents/user"
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
	IdentifierListDocument
} from "$/types/documents/base"

export interface CommentVoteResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "comment_vote"
}

export type CommentVoteAttributes<T extends Format = "serialized"> = TextContentLikeAttributes<T>

interface CommentVoteRelationshipData<T extends Completeness = "read">
extends GeneralRelationshipData {
	comment: {
		serialized: T extends "update" ? undefined : CommentIdentifierDocument,
		deserialized: DeserializedCommentDocument
	},
	user: {
		serialized: T extends "update" ? undefined : UserIdentifierDocument,
		deserialized: DeserializedUserDocument
	}
}

export type CommentVoteRelationshipNames = DeriveRelationshipNames<CommentVoteRelationshipData>

export type CommentVoteRelationships<T extends Completeness = "read">
= DeriveRelationships<CommentVoteRelationshipData<T>>

export type DeserializedCommentVoteRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<CommentVoteRelationshipData<T>>

export type CommentVoteResource<T extends Completeness = "read">
= Resource<
	T,
	CommentVoteResourceIdentifier<T>,
	CommentVoteAttributes
> & (
	T extends "create"
		? CommentVoteRelationships<T>
		: Serializable
)

export type DeserializedCommentVoteResource<
	T extends CommentVoteRelationshipNames|undefined = undefined
> = DeserializedResource<
	CommentVoteResourceIdentifier<"read">,
	CommentVoteAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	CommentVoteRelationshipData<"read">,
	DeserializedCommentVoteRelationships<"read">,
	CommentVoteRelationshipNames,
	T extends CommentVoteRelationshipNames ? true : false,
	T extends CommentVoteRelationshipNames ? T : CommentVoteRelationshipNames
>

export type CommentVoteDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	CommentVoteResourceIdentifier<T>,
	CommentVoteAttributes,
	CommentVoteResource<T>
>

export type CommentVoteListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	CommentVoteResourceIdentifier<T>,
	CommentVoteAttributes,
	CommentVoteResource<T>
>

export type DeserializedCommentVoteDocument<
	T extends CommentVoteRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	CommentVoteResourceIdentifier<"read">,
	CommentVoteAttributes<"deserialized">,
	DeserializedCommentVoteResource<T>
>

export type DeserializedCommentVoteListDocument<
	T extends CommentVoteRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	CommentVoteResourceIdentifier<"read">,
	CommentVoteAttributes<"deserialized">,
	DeserializedCommentVoteResource<T>
>

export type CommentVoteIdentifierDocument
= IdentifierDocument<CommentVoteResourceIdentifier<"read">>

export type CommentVoteIdentifierListDocument
= IdentifierListDocument<CommentVoteResourceIdentifier<"read">>
