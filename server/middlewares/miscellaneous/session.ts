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
			 maxAge: Number(process.env.SESSION_DURATION || String(15 * 60 * 1000))
		}
	})

	async intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		// @ts-ignore
		Session.session(request, response, next)
	}
}
