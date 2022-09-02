import type { Request } from "!/types/dependent"
import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	getDocumentProps(): DocumentProps {
		return {
			"title": "Home | Talakutnangan",
			"description": "Consultation chat platform for MCC"
		}
	}

	getPageProps(request: Request): Serializable {
		return {
			data: "Hello world!"
		}
	}
}
