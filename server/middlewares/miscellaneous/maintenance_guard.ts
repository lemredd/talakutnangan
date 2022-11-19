import type { Request, Response, NextFunction } from "!/types/dependent"

import RequestEnvironment from "$!/singletons/request_environment"
import ForceRedirector from "!/middlewares/miscellaneous/force_redirector"

export default class MaintenanceGuard extends ForceRedirector {
	constructor() {
		super("/", RequestEnvironment.status.TEMPORARY_REDIRECT)
	}

	async intermediate(request: Request, response: Response, next: NextFunction)
	: Promise<void> {
		if (
			RequestEnvironment.isInMaintenanceMode
			&& !(
				request.url === "/"
				&& request.method === "GET"
			)
		) {
			await super.intermediate(request, response, next)
		} else {
			next()
		}
	}
}
