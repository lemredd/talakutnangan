/**
 * @module IndependentTypes
 * @description This module contains types that are independent from third-party packages. Contains
 * 	types that are common in the back-end but not in general.
 */
import type { Serializable } from "$/types/database"

/**
 * Shape to expect for the info returned after checking the temporary URL
 */
export interface TemporaryURLInfo extends Serializable {
	hasExpired: boolean,
	data: Serializable
}
