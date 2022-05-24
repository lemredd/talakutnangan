import createSessionMiddleware from "express-session"
import type { RequestHandler } from "express"

export default function(): RequestHandler {
	return createSessionMiddleware({
		name: process.env.SESSION_NAME || "talakutnangan_session",
		secret: process.env.SESSION_SECRET || "12345678",
		resave: false,
		saveUninitialized: false,
		cookie: {
			 maxAge: process.env.SESSION_DURATION as unknown as number || 15 * 60 * 1000
		}
  })
}
