/**
 * @module IndependentServerTypes
 * @description This module contains types that are independent from any third-party package. But
 * cannot be shareable since they are only used within the server.
 */

import type Middleware from "!/bases/middleware"

/**
 * Used to indicate which middlewares to use in a route.
 */
export type OptionalMiddleware = Middleware | null

/**
 * Shape of middleware arguments for e-mail verification.
 */
export interface EmailVerificationArguments {
	emailsToContact: ({ id: number, email: string })[]
}

/**
 * Shape of middleware arguments for notifying new users about their password.
 */
export interface NewUserNotificationArguments {
	userDetails: {
		name: string,
		email: string,
		kind: string,
		password: string
	}[]
}

/**
 * Shape of middleware arguments for notifying users about password reset.
 */
export interface PasswordResetArguments {
	emailToContact: {
		name: string,
		email: string,
		password: string
	}
}

/**
 * Shape of validation error
 */
export interface ErrorPointer {
	field: string,
	friendlyName?: string,
	messageMaker: (field: string, value: any) => string
}

/**
 * Shape of validation
 */
export interface UsableErrorPointer {
	field: string,
	message: string
}

/**
 * Indicates the error source types usually used for validation errors.
 */
export type SourceType = "parameter"|"pointer"|null

/**
 * Shape of redirect information
 */
export interface RedirectInfo {
	location: string,
	status?: number
}

export interface AuthenticationOptions {
	requireChangedPassword: boolean
}

export interface AdvanceAuthenticationOptions<V> extends AuthenticationOptions {
	checkOthers: (request: V) => Promise<void>
}

export interface RedirectableAuthenticationOptions<V> extends AdvanceAuthenticationOptions<V> {
	"failedRedirectURL": string|null
}
