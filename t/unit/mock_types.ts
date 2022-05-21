import { Request as BaseRequest, Response as BaseResponse } from "!/types"

/**
 * A mock request to test the route controllers
 *
 * Anyone who will add functionality to this class should be careful. Its mock implementation should
 * as close as the `Request` class of "express" package.
 *
 * See https://expressjs.com/en/4x/api.html#req
 */
export class Request implements BaseRequest {}

/**
 * A mock response to test the route controllers
 *
 * Anyone who will add functionality to this class should be careful. Its mock implementation should
 * as close as the `Response` class of "express" package.
 *
 * See https://expressjs.com/en/4x/api.html#res
 */
export class Response implements BaseResponse {
	statusCode: number
	end: () => void

	constructor() {
		this.statusCode = 0
		this.end = jest.fn()
	}
}
