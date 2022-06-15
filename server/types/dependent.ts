/**
 * @module DependentTypes
 * @description This module contains types that are dependent to a third-party package. It was
 * created for compatibility reasons.
 */

import {
	Request as BaseRequest,
	Response as BaseResponse,
	NextFunction as BaseNextFunction,
	RequestHandler as BaseRequestHandler
} from "express"
import type { Session } from "express-session"
import User from "%/models/user"

export interface Request extends BaseRequest {
	// Added due to `express-session` package
	session: Session & {
		token?: string
	}

	// Added due to `passport` package
	user: User|undefined
	isAuthenticated: () => boolean
	logout: () => void
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
export interface IDParameter {
	id: string
}

export interface AuthenticatedIDRequest extends AuthenticatedRequest {
	params: IDParameter & any
}
