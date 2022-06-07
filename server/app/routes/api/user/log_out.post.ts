import { Request, Response } from "express"

import Controller from "!/bases/controller"
import type { RawRoute, WithUser }  from "!/types"

export default class extends Controller {
	get filePath(): string { return __filename }

	async handle(request: Request & WithUser, response: Response): Promise<void> {
		request.logout()

		// TODO: regenerate XSRF-Token or session

		response.redirect("/")
	}
}
