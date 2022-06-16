import { Buffer } from "node:buffer"
import { Request, Response } from "!/types/dependent"

import Policy from "!/bases/policy"
import Middleware from "!/bases/middleware"
import UserManager from "%/managers/user"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import MultipartController from "!/common_controllers/multipart_controller"

 export interface WithImport {
	body: {
		importedCSV: Buffer
	}
}

export default class extends MultipartController {
	get filePath(): string { return __filename }

	// TODO: Use a permission-based policy
	get policy(): Policy { return CommonMiddlewareList.knownOnlyPolicy }

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

		response.status(this.status.NOT_IMPLEMENTED)
	}

	// TODO: Send e-mails to new users
	get postJobs(): Middleware[] {
		return []
	}
}
