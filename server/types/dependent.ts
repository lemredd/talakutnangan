/**
 * @module Dependent
 * @description This module contains types that are dependent to a third-party package. It was
 * created for compatibility reasons.
 */

import type {
	Request as BaseRequest,
	Response as BaseResponse,
	NextFunction as BaseNextFunction
} from "express"

export interface Request extends BaseRequest {}
export interface Response extends BaseResponse {}
export interface NextFunction extends BaseNextFunction {}
