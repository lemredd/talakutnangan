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
import type { ExpressPeerServer } from "peer"
import type { Session } from "express-session"

import type { Serializable } from "$/types/general"
import type { SharedManagerState, SharedAsynchronousOperationState } from "$!/types/dependent"

import BaseManager from "%/managers/base"
import TransactionManager from "%/helpers/transaction_manager"
import AsynchronousOperationManager from "!/singletons/asynchronous_operation_manager"

export interface Request extends BaseRequest, SharedManagerState<TransactionManager> {
	// Added due to `express-session` package
	session: Session & {
		token?: string
	}

	// Added due to `passport` package
	user: Serializable|undefined
	isAuthenticated: () => boolean
	logout: () => void
}

export interface AuthenticatedRequest extends Request {
	session: Session & {
		token: string
	}

	user: Serializable
}

export interface AsynchronousRequest extends AuthenticatedRequest, SharedAsynchronousOperationState<
	TransactionManager,
	AsynchronousOperationManager
> {}

/**
 * Type of request to use to communicate between which have non-standard arguments.
 */
export interface PreprocessedRequest<T = any> extends Request {
	nextMiddlewareArguments: T
}

export type Response = BaseResponse
export type NextFunction = BaseNextFunction
export type RequestHandler = BaseRequestHandler

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

export type PeerServer = ReturnType<typeof ExpressPeerServer>

/**
 * Useful when passing a base manager to other functions/methods
 */
export type BaseManagerClass<T extends SharedManagerState = SharedManagerState>
= new(state?: Partial<T>) => BaseManager<
	any,
	any,
	any,
	any
 >
