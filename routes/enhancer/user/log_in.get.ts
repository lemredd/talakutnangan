import type { Request } from "!/types/dependent"
import type { DocumentProps } from "$/types/server"

import Policy from "!/bases/policy"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import DynamicGatedRedirector from "!/middlewares/miscellaneous/dynamic_gated_redirector"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Log In | Talakutnangan"
		}
	}

	get policy(): Policy {
		return new DynamicGatedRedirector((request: Request) => {
			if (request.user === null) return Promise.resolve(null)
			return Promise.resolve({ "location": "/" })
		}) as unknown as Policy
	}
}
