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
import User from "%/models/user"

export interface Request extends BaseRequest {
	// Added due to `express-session` package
	session: {
		token: string|null
	}

	// Added due to `passport` package
	user: User|null
	isAuthenticated: () => boolean
	logout: () => void
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
