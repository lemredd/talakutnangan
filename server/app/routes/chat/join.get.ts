import { v4 } from "uuid"

import { Request, Response } from "!/types/dependent"

import Controller from "!/bases/controller"

export default class extends Controller {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		response.writeHead(this.status.MOVED_TEMPORARILY, {
			Location: `/chat/room/${v4()}`
		})

		response.end()
	}
}
