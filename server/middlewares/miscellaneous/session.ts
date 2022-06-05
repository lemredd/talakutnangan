import createSessionMiddleware from "express-session"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"

export default class Session extends Middleware {
	private static session = createSessionMiddleware({
		name: process.env.SESSION_NAME || "talakutnangan_session",
		secret: process.env.SESSION_SECRET || "12345678",
		resave: false,
		saveUninitialized: false,
		cookie: {
			 maxAge: process.env.SESSION_DURATION as unknown as number || 15 * 60 * 1000
		}
	})

	intermediate(request: Request, response: Response, next: NextFunction): void {
		Session.session(request, response, next)
	}
}
