import { Request, Response } from "express"

import type { WithUser }  from "!/types"
import Controller from "!/helpers/controller"

export default class extends Controller {
	constructor() {
		super("post", "log_out")
	}

	async handle(request: Request & WithUser, response: Response): Promise<void> {
		request.logout()

		// TODO: regenerate XSRF-Token or session

		response.redirect("/")
	}
}
