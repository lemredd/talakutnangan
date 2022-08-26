/**
 * @module IndependentServerTypes
 * @description This module contains types originally used in database and do not depend from other
 * packages. However, they can be used by other parts of the repository.
 */

import type { Serializable } from "$/types/general"
import type { Format } from "$/types/documents/base"
import type { DeserializedUserProfile } from "$/types/documents/user"
import type { DeserializedRoleListDocument } from "$/types/documents/role"
import type { DeserializedConsultationListDocument } from "$/types/documents/consultation"

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

interface RawPageProps<T extends Format = "serialized"> extends Serializable {
	// Added to pass data from server to client
	userProfile: T extends "deserialized" ? DeserializedUserProfile : Serializable|null

	roles: T extends "deserialized" ? DeserializedRoleListDocument : Serializable|undefined
	consultations: T extends "deserialized"
	? DeserializedConsultationListDocument
	: Serializable|undefined
}

export type AdditionalPropNames<T extends Format = "serialized">
= Exclude<keyof RawPageProps<T>, "userProfile">

export type PageProps<
	T extends Format = "serialized",
	U extends AdditionalPropNames<T>|undefined = undefined
> = U extends AdditionalPropNames<T>
	? Pick<RawPageProps<T>, "userProfile"|U>
	: Pick<RawPageProps<T>, "userProfile"> & Partial<Omit<RawPageProps<T>, "userProfile">>

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
