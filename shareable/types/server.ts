/**
 * @module IndependentServerTypes
 * @description This module contains types originally used in database and do not depend from other
 * packages. However, they can be used by other parts of the repository.
 */

import type { Serializable } from "$/types/general"
import type { DeserializedChatMessageListDocument } from "$/types/documents/chat_message"
import type { DeserializedRoleDocument, DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedPostDocument, DeserializedPostListDocument } from "$/types/documents/post"
import type {
	WeeklySummedTimeDocument,
	ConsolidatedSummedTimeDocument
} from "$/types/documents/consolidated_time"
import type {
	DeserializedCommentDocument,
	DeserializedCommentListDocument
} from "$/types/documents/comment"
import type {
	DeserializedDepartmentDocument,
	DeserializedDepartmentListDocument
} from "$/types/documents/department"
import type {
	DeserializedAuditTrailDocument,
	DeserializedAuditTrailListDocument
} from "$/types/documents/audit_trail"
import type {
	DeserializedSemesterDocument,
	DeserializedSemesterListDocument
} from "$/types/documents/semester"
import type {
	DeserializedTagDocument,
	DeserializedTagListDocument
} from "$/types/documents/tag"
import type {
	DeserializedChatMessageActivityListDocument
} from "$/types/documents/chat_message_activity"
import type {
	DeserializedConsultationDocument,
	DeserializedConsultationListDocument
} from "$/types/documents/consultation"
import type {
	Format,
	DeserializedResourceDocument,
	DeserializedResourceListDocument
} from "$/types/documents/base"
import type {
	DeserializedUserProfile,
	DeserializedUserDocument,
	DeserializedUserListDocument,
	DeserializedUserListWithTimeConsumedDocument
} from "$/types/documents/user"

/**
 * Used to indicate the type of current environment where the script is running.
 */
// eslint-disable-next-line no-shadow
export enum Environment {
	Production,
	Development,
	UnitTest,
	IntegrationTest
}

/**
 * List of methods that is supported by `express` package
 */
export type Method = "get" | "post" | "patch" | "delete"

/**
 * Used to indicate the purpose of a certain registered custom route.
 *
 * Here are the meanings of the following values:
 * - "api". Route is used as REST API.
 * - "enhancer". Route is used to enhance to the view route it is associated.
 * - "dev". Route is used for development.
 */
export type Purpose = "api" | "enhancer" | "dev"

/**
 * Used to provide route information to be used by server routers.
 */
export interface RouteInformation {
	method: Method,
	path: string,
	purpose: Purpose,
	description: string|null
}

type OptionalPageProps<
	T extends Format,
	U extends DeserializedResourceDocument<any, any, any>
		| DeserializedResourceListDocument<any, any, any>
		| Serializable
> = T extends "deserialized" ? U : Serializable|undefined

interface RawPageProps<T extends Format = "serialized"> extends Serializable {
	// Added to pass data from server to client
	userProfile: T extends "deserialized"
		? DeserializedUserProfile<"roles"|"department">
		: Serializable|null

	users: OptionalPageProps<T, DeserializedUserListDocument>
	user: OptionalPageProps<T, DeserializedUserDocument>

	roles: OptionalPageProps<T, DeserializedRoleListDocument>
	role: OptionalPageProps<T, DeserializedRoleDocument>

	departments: OptionalPageProps<T, DeserializedDepartmentListDocument>
	department: OptionalPageProps<T, DeserializedDepartmentDocument>

	semesters: OptionalPageProps<T, DeserializedSemesterListDocument>
	semester: OptionalPageProps<T, DeserializedSemesterDocument>

	tags: OptionalPageProps<T, DeserializedTagListDocument>
	tag: OptionalPageProps<T, DeserializedTagDocument>

	audit_trails: OptionalPageProps<T, DeserializedAuditTrailListDocument>
	audit_trail: OptionalPageProps<T, DeserializedAuditTrailDocument>

	consultations: OptionalPageProps<T, DeserializedConsultationListDocument>
	consultation: OptionalPageProps<T, DeserializedConsultationDocument>

	chatMessageActivities: OptionalPageProps<T, DeserializedChatMessageActivityListDocument>

	chatMessages: OptionalPageProps<T, DeserializedChatMessageListDocument>
	previewMessages: OptionalPageProps<T, DeserializedChatMessageListDocument>

	timeConsumedforConsolidation: OptionalPageProps<T, ConsolidatedSummedTimeDocument>
	timeConsumedPerStudent: OptionalPageProps<T, DeserializedUserListWithTimeConsumedDocument>
	timeConsumedPerWeek: OptionalPageProps<T, WeeklySummedTimeDocument>

	posts: OptionalPageProps<T, DeserializedPostListDocument>
	post: OptionalPageProps<T, DeserializedPostDocument>

	comments: OptionalPageProps<T, DeserializedCommentListDocument>
	comment: OptionalPageProps<T, DeserializedCommentDocument>
}

export type AdditionalPropNames<T extends Format = "serialized"> = keyof RawPageProps<T>

export type PageProps<
	T extends Format = "serialized",
	U extends AdditionalPropNames<T> = "userProfile"
> = Pick<RawPageProps<T>, "userProfile"|U>

export type PartialPageProps<T extends Format = "serialized"> =
	& Pick<RawPageProps<T>, "userProfile">
	& Partial<Omit<RawPageProps<T>, "userProfile">>

export interface DocumentProps extends Serializable {
	title: string
	description: string
}

/**
 * Source of error in the sent resource
 */
export interface SourcePointer extends Serializable {
	pointer: string
}

/**
 * Source of error in the parameter
 */
export interface SourceParameter extends Serializable {
	parameter: string
}

/**
 * Errors output by the server
 */
export interface UnitError {
	status: number,
	code: string,
	title: string,
	detail: string,
	meta?: Serializable
	source?: SourcePointer|SourceParameter
}

// Media types used in the application
export const HTML_MEDIA_TYPE = "text/html"
export const JSON_MEDIA_TYPE = "application/json"
export const MULTIPART_MEDIA_TYPE = "multipart/form-data"
export const JSON_API_MEDIA_TYPE = "application/vnd.api+json"
