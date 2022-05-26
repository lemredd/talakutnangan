import passport from "passport"
import express from "express"
import type { Request, Response, NextFunction } from "express"

import Middleware from "!/helpers/middleware";

export default class extends Middleware {
	protected intermediate(request: Request, response: Response, next: NextFunction): void {
		passport
			.authenticate("local", {
				failureRedirect: "/api/user/log_in_failure"
			})(request, response, next)
	}
}
