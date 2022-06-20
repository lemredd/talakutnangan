import { Buffer } from "buffer"
import { Request, Response } from "!/types/dependent"

import MultipartController from "!/common_controllers/multipart_controller"

 export interface WithImport {
	body: {
		importedCSV: Buffer
	}
}

export default class extends MultipartController {
	get filePath(): string { return __filename }

	// TODO: Use a permission-based policy
	get policy(): null { return null }

	get bodyValidationRules(): object {
		return {}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const info: { [key:string]: string } = {}
		const body = request.body

		for (const field in body) {
			if (Object.prototype.hasOwnProperty.call(body, field)) {
				const value = body[field];
				info[field] = value
			}
		}

		response.status(this.status.OK).json(info)
	}
}
