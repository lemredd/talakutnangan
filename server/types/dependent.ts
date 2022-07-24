/**
 * @module DependentTypes
 * @description This module contains types that are dependent to a third-party package. It was
 * created for compatibility reasons.
 */

import type {
	Request as BaseRequest,
	Response as BaseResponse,
	NextFunction as BaseNextFunction,
	RequestHandler as BaseRequestHandler
} from "express"
import type { Session } from "express-session"
import type { Serializable } from "$/types/database"
import TransactionManager from "%/managers/helpers/transaction_manager"

// @ts-ignore
export interface Request extends BaseRequest {
	// Added due to `express-session` package
	session: Session & {
		token?: string
	}

	// Added due to `passport` package
	user: Serializable|undefined
	isAuthenticated: () => boolean
	logout: () => void

	// Added to manage the transactions
	transaction: TransactionManager
}

export interface AuthenticatedRequest extends Request {
	session: Session & {
		token: string
	}

	user: Serializable
}

/**
 * Type of request to use to communicate between which have non-standard arguments.
 */
export interface PreprocessedRequest<T = any> extends Request {
	nextMiddlewareArguments: T
}

export interface Response extends BaseResponse {}
export interface NextFunction extends BaseNextFunction {}
export interface RequestHandler extends BaseRequestHandler {}

import { ParsedQs } from "qs"
export type Query = ParsedQs

import { ParamsDictionary } from "express-serve-static-core"
export type Parameters = ParamsDictionary
export interface IDParameter extends Parameters {
	id: string
}

export interface AuthenticatedIDRequest extends AuthenticatedRequest {
	params: IDParameter
}

/**
 * Shape of validation state
 */
export interface ValidationState<T extends BaseRequest = Request> {
	request: T,
	field: string,
	value: any
}
