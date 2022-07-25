/**
 * @module IndependentServerTypes
 * @description This module contains types that are independent from any third-party package. But
 * cannot be shareable since they are only used within the server.
 */

import type { UserKind, Pipe } from "$/types/database"
import BaseManager from "%/managers/base"

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
		kind: UserKind,
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
 * Expected shape of the validation rules used mostly in controllers.
 */
export type ValidationRules = { [key:string]: any[] }

/**
 * Useful when passing a base manager to other functions/methods
 */
export type BaseManagerClass = new() => BaseManager<any, any>

/**
 * Shape of validation
 */
export interface ErrorPointer {
	field: string,
	messageMaker: (field: string, value: any) => string
}

/**
 * Shape of validation
 */
export interface UsableErrorPointer {
	field: string,
	message: string
}

export interface SameRuleConstraints { same: any }

export interface ArrayRuleConstraints {
	array: {
		rules: Rules,
		minimum?: number,
		maximum?: number
	}
}

export interface ObjectRuleConstraints {
	object: FieldRules
}

export interface ManagerBasedRuleConstraints {
	manager: {
		className: BaseManagerClass,
		columnName: string
	}
}

/**
 * Union of rule contraints
 */
export type RuleContraints = Partial<
	& SameRuleConstraints
	& ArrayRuleConstraints
	& ObjectRuleConstraints
	& ManagerBasedRuleConstraints
>

/**
 * Shape of validation constraints
 */
 export interface ValidationConstraints<T = any> extends RuleContraints {
	request: T,
	field: string
}

/**
 * Shape of validation state
 */
export interface ValidationState {
	value: any,
	// If true, other rules should be skipped.
	maySkip: boolean
}

/**
 * Shape of validation rules
 */
export interface Rules {
	pipes: Pipe<Promise<ValidationState>, ValidationConstraints & any>[],
	constraints: RuleContraints
}

/**
 * Shape of validation rules for all fields
 */
export interface FieldRules {
	[key:string]: Rules
}

/**
 * Useful for general safe object
 */
export type GeneralObject<T = any> = { [key: string]: T }

/**
 * Shape of validation constraints that are not part of main info.
 *
 * They are usually used internally.
 */
export interface MetaValidationConstraints {
	transformer?: Function
}
