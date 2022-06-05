import passport from "passport"
import express from "express"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware";

export default class extends Middleware {
	intermediate(request: Request, response: Response, next: NextFunction): void {
		passport
			.authenticate("local", {
				failureRedirect: "/api/user/log_in_failure"
			})(request, response, next)
	}
}
