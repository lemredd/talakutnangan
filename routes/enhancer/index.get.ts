import type { Request } from "!/types/dependent"
import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Home | Talakutnangan"
		}
	}

	getPageProps(unusedRequest: Request): Serializable {
		return {
			"isInMaintenance": true
		}
	}
}
