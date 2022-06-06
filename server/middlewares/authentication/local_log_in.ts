import passport from "passport"
import express from "express"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware";

export default class LocalLogIn extends Middleware {
	private static authenticate = passport.authenticate("local", {
		failureRedirect: "/api/user/log_in_failure"
	})

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		LocalLogIn.authenticate(request, response, next)
	}
}
