import passport from "passport"
import type { RequestHandler, Request, Response, NextFunction } from "express"

export default function(): RequestHandler[] {
	return [
		passport.initialize(),

		// Disable middleware below if application is not using persistent log in.
		// See README in https://github.com/jaredhanson/passport
		passport.session()
	]
}
