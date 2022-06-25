/**
 * @module IndependentServerTypes
 * @description This module contains types that are independent from any third-party package. But
 * cannot be shareable since they are only used within the server.
 */

/**
 * Shape of middleware arguments for e-mail verification.
 */
export interface EmailVerificationArguments {
	emailsToContact: string[]
}
