import type { GeneralObject } from "$/types/general"
import type { UserIdentifierDocument, DeserializedUserDocument } from "$/types/documents/user"
import type {
	Completeness,
	Format,

	Attributes,

	DeriveRelationships,
	DeriveRelationshipNames,
	GeneralRelationshipData,
	DeriveDeserializedRelationships
} from "$/types/documents/base"

export interface AsynchronousLikeRelationshipData<T extends Completeness = "read">
extends GeneralRelationshipData {
	user: {
		serialized: T extends "update" ? undefined : UserIdentifierDocument,
		deserialized: DeserializedUserDocument
	}
}

export type AsynchronousLikeRelationshipNames
= DeriveRelationshipNames<AsynchronousLikeRelationshipData>

export type AsynchronousLikeRelationships<T extends Completeness = "read">
= DeriveRelationships<AsynchronousLikeRelationshipData<T>>

export type DeserializedAsynchronousLikeRelationships<T extends Completeness = "read">
= DeriveDeserializedRelationships<AsynchronousLikeRelationshipData<T>>

export interface AsynchronousLikeAttributes<T extends Format = "serialized">
extends Attributes<T> {
	origin: string,
	token: string,
	finishedStepCount: number,
	totalStepCount: number,
	hasStopped: boolean
	extra: GeneralObject
}
