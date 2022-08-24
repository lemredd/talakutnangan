import passport from "passport"
import type { Request, Response } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"

export default class Initializer extends RequestFilter {
	private static intialize = passport.initialize()

	async filterRequest(request: Request): Promise<void> {
		await new Promise<void>((resolve, reject) => {
			Initializer.intialize(request, {} as Response, (error?: any) => {
				if (error) reject(error)
				resolve()
			})
		})
	}
}
