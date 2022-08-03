import { Request, Response } from "!/types/dependent"

import BaseError from "$!/errors/base"

import DevController from "!/controllers/dev_controller"

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		response.status(this.status.OK)
		response.send({
			hostname: request.hostname,
			protocol: request.protocol
		})
	}
}
