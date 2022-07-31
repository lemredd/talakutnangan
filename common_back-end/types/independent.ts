/**
 * @module IndependentTypes
 * @description This module contains types that are independent from third-party packages. Contains
 * 	types that are common in the back-end but not in general.
 */
import type { Serializable } from "$/types/general"
import type { UserKindValues } from "$/types/database"

/**
 * Shape to expect for the info returned after checking the temporary URL
 */
export interface TemporaryURLInfo extends Serializable {
	hasExpired: boolean,
	data: Serializable
}

export interface RawUser {
	name?: string,
	email?: string,
	password?: string,
	kind?: UserKind,
	emailVerifiedAt?: Date|null,
	admittedAt?: Date|null,
	signature?: Buffer|null
}
