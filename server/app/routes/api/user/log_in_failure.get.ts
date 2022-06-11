import { Request, Response } from "!/types/dependent"

import Controller from "!/bases/controller-like/controller"

export default class extends Controller {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		response.status(this.status.UNAUTHORIZED).json({
			email: [
				"User cannot be found"
			]
		})
	}
}
