import express from "express"

import { JSON_MEDIA_TYPE, JSON_API_MEDIA_TYPE } from "$/types/server"

import Middleware from "!/bases/middleware"
import type { Request, Response, NextFunction } from "!/types/dependent"

export default class JSONBodyParser extends Middleware {
	private static parse = express.json({
		type: [
			JSON_MEDIA_TYPE,
			JSON_API_MEDIA_TYPE
		]
	})

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		JSONBodyParser.parse(request, response, next)
	}
}
