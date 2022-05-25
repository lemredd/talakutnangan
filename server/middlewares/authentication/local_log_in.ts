import Middleware from "!/helpers/middleware";
import express from "express"
import type { Request, Response, NextFunction } from "express"

export default class extends Middleware {
	private intermediate(request: Request, response: Response, next: NextFunction): void {
		passport
			.authenticate("local", {
				failureRedirect: "/api/user/log_in_failure"
			})(request, response, next)
	}
}
