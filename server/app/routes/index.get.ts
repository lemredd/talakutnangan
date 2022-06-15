import { Request } from "!/types/dependent"
import { Serializable } from "%/types/independent"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	getClientPayload(request: Request): Serializable {
		return {
			data: "Hello world!"
		}
	}
}
