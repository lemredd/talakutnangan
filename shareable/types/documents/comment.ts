import type { Serializable } from "$/types/general"
import type { TextContentLikeAttributes } from "$/types/documents/text_content-like"
import type { PostIdentifierDocument, DeserializedPostDocument } from "$/types/documents/post"
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
	IdentifierListDocument,

	MetaDocument
} from "$/types/documents/base"

export interface CommentResourceIdentifier<T extends Completeness = "read">
extends ResourceIdentifier<T> {
	type: "comment"
}

export type CommentAttributes<T extends Format = "serialized"> = TextContentLikeAttributes<T>

interface CommentRelationshipData<T extends Completeness = "read">
extends GeneralRelationshipData {
	user: {
		serialized: T extends "update" ? undefined : UserIdentifierDocument,
		deserialized: DeserializedUserDocument
	},
	post: {
		serialized: T extends "update"
			? undefined
			: PostIdentifierDocument,
		deserialized: DeserializedPostDocument
	}
}

export type CommentRelationshipNames = DeriveRelationshipNames<CommentRelationshipData>

export type CommentRelationships<T extends Completeness = "read">
= DeriveRelationships<CommentRelationshipData<T>>

export type DeserializedCommentRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<CommentRelationshipData<T>>

export type CommentResource<T extends Completeness = "read">
= Resource<
	T,
	CommentResourceIdentifier<T>,
	CommentAttributes
> & (
	T extends "create"
		? CommentRelationships<T>
		: Serializable
)

type WithVoteInfo = MetaDocument<{
	upvoteCount: number,
	downvoteCount: number,
	currentUserVoteStatus: "upvoted"|"downvoted"|"unvoted"
}>

export type DeserializedCommentResource<
	T extends CommentRelationshipNames|undefined = undefined
> = DeserializedResource<
	CommentResourceIdentifier<"read">,
	CommentAttributes<"deserialized">
> & PartialOrPickDeserializedRelationship<
	CommentRelationshipData<"read">,
	DeserializedCommentRelationships<"read">,
	CommentRelationshipNames,
	T extends CommentRelationshipNames ? true : false,
	T extends CommentRelationshipNames ? T : CommentRelationshipNames
> & Partial<WithVoteInfo>

export type CommentDocument<T extends Completeness = "read"> = ResourceDocument<
	T,
	CommentResourceIdentifier<T>,
	CommentAttributes,
	CommentResource<T>
>

export type CommentListDocument<T extends Completeness = "read"> = ResourceListDocument<
	T,
	CommentResourceIdentifier<T>,
	CommentAttributes,
	CommentResource<T>
>

export type DeserializedCommentDocument<
	T extends CommentRelationshipNames|undefined = undefined
> = DeserializedResourceDocument<
	CommentResourceIdentifier<"read">,
	CommentAttributes<"deserialized">,
	DeserializedCommentResource<T>
>

export type DeserializedCommentListDocument<
	T extends CommentRelationshipNames|undefined = undefined
> = DeserializedResourceListDocument<
	CommentResourceIdentifier<"read">,
	CommentAttributes<"deserialized">,
	DeserializedCommentResource<T>
>

export type CommentIdentifierDocument
= IdentifierDocument<CommentResourceIdentifier<"read">>

export type CommentIdentifierListDocument
= IdentifierListDocument<CommentResourceIdentifier<"read">>

export type CommentIdentifierListDocumentWithVotes
= IdentifierListDocument<CommentResourceIdentifier<"read"> & WithVoteInfo>
