import passport from "passport"
import type { RequestHandler, Request, Response, NextFunction } from "express"

export default function(): RequestHandler[] {
	return [
		passport.initialize(),

		// Disable middleware below if not using persistent log in.
		passport.session()
	]
}
