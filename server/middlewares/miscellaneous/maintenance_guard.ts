import type { Request, Response, NextFunction } from "!/types/dependent"

import { HOME } from "$/constants/template_page_paths"
import RequestEnvironment from "$/singletons/request_environment"
import ForceRedirector from "!/middlewares/miscellaneous/force_redirector"

export default class MaintenanceGuard extends ForceRedirector {
	constructor() {
		super(HOME, RequestEnvironment.status.TEMPORARY_REDIRECT)
	}

	async intermediate(request: Request, response: Response, next: NextFunction)
	: Promise<void> {
		if (
			process.env.IS_IN_MAINTENANCE
			&& process.env.IS_IN_MAINTENANCE !== "false"
			&& !(
				request.url === HOME
				&& request.method === "GET"
			)
		) {
			await super.intermediate(request, response, next)
		} else {
			next()
		}
	}
}
