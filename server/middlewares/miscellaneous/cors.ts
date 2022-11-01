import cors from "cors"
import type { Request, Response, NextFunction } from "!/types/dependent"

import UrlMaker from "$!/singletons/url_maker"
import RequestFilter from "!/bases/request_filter"

const ALLOWED_LIST = [
	UrlMaker.makeBaseURL(),
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
		}
	}

	intermediate(request: Request, response: Response, next: NextFunction): Promise<void> {
		// @ts-ignore
		Session.session(request, response, next)
		return Promise.resolve()
	}

	filterRequest(unusedRequest: Request): Promise<void> {
		/*
		 * Since intermediate method was overrided, just return a resolve promise to follow
		 * base class' requirements.
		 */
		return Promise.resolve()
	}
}
