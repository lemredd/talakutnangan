import Middleware from "!/bases/middleware";
import express from "express"
import type { Request, Response, NextFunction } from "!/types/dependent"

export default class JSONBodyParser extends Middleware {
	private static parse = express.json()

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		JSONBodyParser.parse(request, response, next)
	}
}
