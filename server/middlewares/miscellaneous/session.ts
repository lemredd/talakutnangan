import createSessionMiddleware from "express-session"
import type { Request, Response, NextFunction, RequestHandler } from "express"

import Middleware from "!/routes/base/middleware"

export default class extends Middleware {
	intermediate(request: Request, response: Response, next: NextFunction): void {}

	generateHandlers(): RequestHandler[] {
		return [
			createSessionMiddleware({
				name: process.env.SESSION_NAME || "talakutnangan_session",
				secret: process.env.SESSION_SECRET || "12345678",
				resave: false,
				saveUninitialized: false,
				cookie: {
					 maxAge: process.env.SESSION_DURATION as unknown as number || 15 * 60 * 1000
				}
		  })
		]
	}
}
