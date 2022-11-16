/**
 * @module IndependentClientTypes
 * @description This module contains types that are independent from any third-party package. But
 * cannot be shareable since they are only used within the client.
 */

import type { UserKind } from "$/types/database"
import type { Serializable } from "$/types/general"
import type PermissionGroup from "$/permissions/base"
import type { CommonQueryParameters } from "$/types/query"
import type { DeserializedRoleResource } from "$/types/documents/role"
import type { DeserializedSemesterResource } from "$/types/documents/semester"
import type { DeserializedDepartmentResource } from "$/types/documents/department"
import type { DeserializedAuditTrailResource } from "$/types/documents/audit_trail"
import type { DeserializedUserResource, DeserializedUserProfile } from "$/types/documents/user"
import type {
	ResourceIdentifier,
	Attributes,
	Resource,
	DeserializedResource,
	ResourceDocument,
	ResourceListDocument,
	DeserializedResourceDocument,
	DeserializedResourceListDocument,
	IdentifierDocument,
	IdentifierListDocument
} from "$/types/documents/base"
import { DeserializedTagResource } from "$/types/documents/tag"
/**
 * Shape of expected page context parameter of common front-end functions
 */
export interface DeserializedPageContext extends Serializable {
	pageProps: {
		userProfile: DeserializedUserProfile<"roles"|"department">|null
	}
}

type SupportedViewport = "mobile"|"desktop"

/**
 * Shape of link info
 */
export interface LinkInfo {
	name: string,
	path: string,
	icon: string,
	viewportsAvailable: SupportedViewport[]
}

/**
 * Group of links that may show depending on the conditions configured
 */
export interface ConditionalLinkInfo<T, U extends PermissionGroup<any, T>> {
	/**
	 * If true, there should be no authenticated user
	 */
	mustBeGuest: boolean,

	/**
	 * If null, user may be unauthenticated
	 * If array, user must be one of the specified kinds
	 */
	kinds: UserKind[]|null,

	/**
	 * If null, user may be unauthenticated
	 * If array, requires user to be authenticated and the link is allowed under certain permissions
	 */
	permissionCombinations: T[][]|null,

	/**
	 * If null, user may be unauthenticated
	 * If class instance, indicates the group where the permission combinations belong
	 */
	permissionGroup: U|null,

	/**
	 * Array of links if it passes the conditions above
	 */
	links: LinkInfo[]
}

/**
 * Shape of expected log in details
 */
export interface LogInDetails extends Serializable {
	email: string,
	password: string
}

type PossibleResponseTypes<
	T extends ResourceIdentifier<"read">,
	U extends Attributes<"serialized">,
	V extends Attributes<"deserialized">,
	W extends Resource<"read", T, U>,
	X extends DeserializedResource<T, V>
> =
	| ResourceDocument<"read", T, U, W>
	| ResourceListDocument<"read", T, U, W>
	| DeserializedResourceDocument<T, V, X>
	| DeserializedResourceListDocument<T, V, X>
	| IdentifierDocument<T>
	| IdentifierListDocument<T>
	| Serializable

/**
 * Shape of expected response from fetcher
 */
export interface Response<
	T extends ResourceIdentifier<"read">,
	U extends Attributes<"serialized">,
	V extends Attributes<"deserialized">,
	W extends Resource<"read", T, U>,
	X extends DeserializedResource<T, V>,
	Y extends PossibleResponseTypes<T, U, V, W, X>|null = PossibleResponseTypes<T, U, V, W, X>
> extends Serializable {
	body: Y,
	status: number
}

export type PossibleResources =
	| DeserializedUserResource
	| DeserializedDepartmentResource
	| DeserializedRoleResource
	| DeserializedSemesterResource
	| DeserializedTagResource
	| DeserializedAuditTrailResource

export type Timer = ReturnType<typeof setInterval>

export type FullTime = {
	hours: number,
	minutes: number,
	seconds: number
}

export interface GenericFetcherParameters {
	"otherDocuments": Serializable,
	"queryParameters": CommonQueryParameters,
	"extraCreateData": Serializable,
	"extraCreateDocumentProps": Serializable,
	"extraUpdateData": Serializable,
	"extraUpdateDocumentProps": Serializable,
	"archiveMeta": Serializable,
	"restoreMeta": Serializable
}

export type OtherDocuments<T extends Partial<GenericFetcherParameters>>
= T["otherDocuments"] extends Serializable ? T["otherDocuments"] : Serializable

export type QueryParameters<T extends Partial<GenericFetcherParameters>>
= T["queryParameters"] extends CommonQueryParameters ? T["queryParameters"] : CommonQueryParameters

export type ExtraCreateData<T extends Partial<GenericFetcherParameters>>
= T["extraCreateData"] extends Serializable ? T["extraCreateData"] : Serializable

export type ExtraCreateDocumentProps<T extends Partial<GenericFetcherParameters>>
= T["extraCreateDocumentProps"] extends Serializable ? T["extraCreateDocumentProps"] : Serializable

export type ExtraUpdateData<T extends Partial<GenericFetcherParameters>>
= T["extraUpdateData"] extends Serializable ? T["extraUpdateData"] : Serializable

export type ExtraUpdateDocumentProps<T extends Partial<GenericFetcherParameters>>
= T["extraUpdateDocumentProps"] extends Serializable ? T["extraUpdateDocumentProps"] : Serializable

export type ArchiveMeta<T extends Partial<GenericFetcherParameters>>
= T["archiveMeta"] extends Serializable ? T["archiveMeta"] : Serializable

export type RestoreMeta<T extends Partial<GenericFetcherParameters>>
= T["restoreMeta"] extends Serializable ? T["restoreMeta"] : Serializable

export interface UserManagementInfo {
	isDeleted: boolean,
	mayUpdateUser: boolean,
	mayArchiveUser: boolean,
	mayRestoreUser: boolean,
	mayUpdateAttachedRoles: boolean,
	mayResetPassword: boolean
}
