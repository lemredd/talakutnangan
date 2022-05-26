import Middleware from "!/helpers/middleware";
import express from "express"
import type { Request, Response, NextFunction } from "express"

export default class extends Middleware {
	protected intermediate(request: Request, response: Response, next: NextFunction): void {
		express.json()(request, response, next)
	}
}
