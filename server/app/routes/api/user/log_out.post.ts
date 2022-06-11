import type { Request, Response }  from "!/types/dependent"

import Controller from "!/bases/controller"

export default class extends Controller {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		request.logout()

		// TODO: regenerate XSRF-Token or session

		response.redirect("/")
	}
}
