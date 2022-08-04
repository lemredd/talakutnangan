import { Request } from "!/types/dependent"
import { Serializable } from "$/types/general"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	getPageProps(request: Request): Serializable {
		return {
			data: "Hello world!"
		}
	}
}
