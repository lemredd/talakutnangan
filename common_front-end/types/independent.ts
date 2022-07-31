/**
 * @module IndependentClientTypes
 * @description This module contains types that are independent from any third-party package. But
 * cannot be shareable since they are only used within the client.
 */

import type { UserKind } from "$/types/database"
import type { Serializable } from "$/types/general"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type PermissionGroup from "$/permissions/base"

/**
 * Shape of expected page context parameter of common front-end functions
 */
export interface DeserializedPageContext extends Serializable {
	pageProps: {
		userProfile: DeserializedUserProfile|null
	}
}

/**
 * Shape of link info
 */
export interface LinkInfo {
	name: string,
	path: string,
	icon: string
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

/**
 * Shape of expected response from fetcher
 */
export interface Response extends Serializable {
	body: {
		data?: Serializable,
		meta?: Serializable
	},
	status: number
}
