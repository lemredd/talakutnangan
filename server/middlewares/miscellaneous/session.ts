import createSessionMiddleware, { Store } from "express-session"
import makeSequelizeStore from "connect-session-sequelize"
import type { Request, Response, NextFunction } from "!/types/dependent"

import Middleware from "!/bases/middleware"
import Database from "%/data_source/database"

export default class Session extends Middleware {
	private static session = createSessionMiddleware({
		"name": process.env.SESSION_NAME || "talakutnangan_session",
		"secret": process.env.SESSION_SECRET || "12345678",
		"resave": false,
		"saveUninitialized": false,
		"cookie": {
			"maxAge": process.env.SESSION_DURATION as unknown as number || 15 * 60 * 1000
		},
		"store": new (makeSequelizeStore(Store))({ "db": Database.dataSource })
	})

	intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		// @ts-ignore
		Session.session(request, response, next)
		return Promise.resolve()
	}
}
