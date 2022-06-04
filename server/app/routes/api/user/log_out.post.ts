import { Request, Response } from "express"

import Controller from "!/bases/controller"
import type { RawRoute, WithUser }  from "!/types"

export default class extends Controller {
	getRawRoute(): RawRoute {
		return {
			method: "get",
			baseURL: "log_out"
		}
	}

	async handle(request: Request & WithUser, response: Response): Promise<void> {
		request.logout()

		// TODO: regenerate XSRF-Token or session

		response.redirect("/")
	}
}
