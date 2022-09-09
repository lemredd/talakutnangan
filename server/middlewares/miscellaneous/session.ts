import makeSequelizeStore from "connect-session-sequelize"
import createSessionMiddleware, { Store } from "express-session"

import type { Request } from "!/types/dependent"

import Log from "$!/singletons/log"
import Database from "%/data_source/database"
import RequestFilter from "!/bases/request_filter"

const MILLISECONDS_PER_SECOND = 1000
const SECONDS_PER_MINUTE = 60
const EXPIRATION_MINUTE_DURATION = 15
const EXPIRATION_MILLISECOND_DURATION
	= MILLISECONDS_PER_SECOND
		* SECONDS_PER_MINUTE
		* EXPIRATION_MINUTE_DURATION

export default class Session extends RequestFilter {
	private static session = createSessionMiddleware({
		"cookie": {
			"maxAge": Number(process.env.SESSION_DURATION || String(EXPIRATION_MILLISECOND_DURATION)),
			"sameSite": "strict"
		},
		"name": process.env.SESSION_NAME || "talakutnangan_session",
		"resave": false,
		"saveUninitialized": false,
		"secret": process.env.SESSION_SECRET || "12345678"
	})

	constructor() {
		super()

		/*
		 * Prevent changing the memory store for tests
		 * Please see: https://www.npmjs.com/package/connect-session-sequelize
		 */
		if (!this.isOnTest) {
			Session.session = createSessionMiddleware({
				"cookie": {
					"maxAge": Number(
						process.env.SESSION_DURATION
						|| String(EXPIRATION_MILLISECOND_DURATION)
					),
					"sameSite": "strict"
				},
				"name": process.env.SESSION_NAME || "talakutnangan_session",
				"resave": false,
				"saveUninitialized": false,
				"secret": process.env.SESSION_SECRET || "12345678",
				"store": new (makeSequelizeStore(Store))({
					"db": Database.dataSource,
					"tableName": "Sessions"
				})
			})
			Log.trace("app", "changed the session middleware for live server.")
		}
	}

	async filterRequest(request: Request): Promise<void> {
		await this.runFilter(Session.session, request)
	}
}
