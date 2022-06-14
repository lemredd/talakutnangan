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
import User from "%/models/user"
import type { UserProfile } from "%/types/independent"

export interface Payload {
	[key: string]:
		| string
		| number
		| boolean
		| null
		| Payload[]
		| Payload
}

export interface ClientPayload extends Payload {
	user: UserProfile
}

// @ts-ignore
export interface Request extends BaseRequest {
	// Added due to `express-session` package
	session: Session & {
		token?: string
	}

	// Added due to `passport` package
	user: User|undefined
	isAuthenticated: () => boolean
	logout: () => void

	// Added to pass data from server to client
	clientPayload: ClientPayload
}

export interface AuthenticatedRequest extends Request {
	session: Session & {
		token: string
	}

	user: User
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
