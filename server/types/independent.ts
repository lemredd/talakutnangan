/**
 * @module IndependentServerTypes
 * @description This module contains types that are independent from any third-party package. But
 * cannot be shareable since they are only used within the server.
 */

import type { UserKind } from "$/types/database"

/**
 * Shape of middleware arguments for e-mail verification.
 */
export interface EmailVerificationArguments {
	emailsToContact: string[]
}

/**
 * Shape of middleware arguments for notifying new users about their password.
 */
export interface NewUserNotificationArguments {
	userDetails: {
		name: string,
		email: string,
		kind: UserKind,
		password: string
	}[]
}

// Media types

export const HTML_MEDIA_TYPE = "text/html"
export const JSON_API_MEDIA_TYPE = "application/vnd.api+json"
