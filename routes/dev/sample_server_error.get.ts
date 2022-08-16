import { Request, Response } from "!/types/dependent"

import BaseError from "$!/errors/base"

import DevController from "!/controllers/dev"

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		throw new BaseError(
			"-1",
			400,
			"Sample Error Redirection",
			"This error message may be received through browser or API"
		)
	}
}
