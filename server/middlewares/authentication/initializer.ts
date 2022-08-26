import passport from "passport"
import type { Request } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"

export default class Initializer extends RequestFilter {
	private static intialize = passport.initialize()

	async filterRequest(request: Request): Promise<void> {
		await this.runFilter(Initializer.intialize, request)
	}
}
