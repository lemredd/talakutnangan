import { Request, Response } from "!/types/dependent"

import AuthorizationError from "$!/errors/authorization"
import DevController from "!/common_controllers/dev_controller"

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		throw new AuthorizationError("Sample athorization error")
	}
}
