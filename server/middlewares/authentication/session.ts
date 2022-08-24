import passport from "passport"
import type { Request, Response } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"

export default class Session extends RequestFilter {
	private static session = passport.session()

	async filterRequest(request: Request): Promise<void> {
		await new Promise<void>((resolve, reject) => {
			Session.session(request, {} as Response, (error?: any) => {
				if (error) reject(error)
				resolve()
			})
		})
	}
}
