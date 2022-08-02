import type { FieldRules } from "!/types/validation"
import type { Request, Response } from "!/types/dependent"

import MultipartController from "!/common_controllers/multipart_controller"

export default class extends MultipartController {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	makeBodyRuleGenerator(request: Request): FieldRules {
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
