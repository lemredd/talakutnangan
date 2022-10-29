import type { DocumentProps } from "$/types/server"

import Middleware from "!/bases/middleware"
import URLMaker from "$!/singletons/url_maker"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import ForceRedirector from "!/middlewares/miscellaneous/force_redirector"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): null { return null }

	get postPolicyMiddlewares(): Middleware[] {
		return [
			new ForceRedirector(URLMaker.makeBaseURL())
		]
	}

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Home | Talakutnangan"
		}
	}
}
