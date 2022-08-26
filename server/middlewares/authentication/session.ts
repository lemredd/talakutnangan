import passport from "passport"
import type { Request } from "!/types/dependent"

import RequestFilter from "!/bases/request_filter"

export default class Session extends RequestFilter {
	private static session = passport.session()

	async filterRequest(request: Request): Promise<void> {
		await this.runFilter(Session.session, request)
	}
}
