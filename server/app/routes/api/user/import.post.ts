import { Buffer } from "node:buffer"
import { Request, Response } from "!/types/dependent"

import Middleware from "!/bases/middleware"
import Controller from "!/bases/controller-likes/controller"
import UserManager from "%/managers/user_manager"

 export interface WithImport {
	body: {
		importedCSV: Buffer
	}
}

export default class extends Controller {
	get filePath(): string { return __filename }

	get bodyValidationRules(): object {
		// Create validator for buffers
		return {
			importedCSV: [ "required" ]
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new UserManager()

		// TODO: READ the CSV file
		// TODO: Pass the the converted CSV file to user manager

		response.status(this.status.NOT_IMPLEMENTED).end()
	}

	get postJobs(): Middleware[] {
		return [
			...super.postJobs
		]
	}
}
