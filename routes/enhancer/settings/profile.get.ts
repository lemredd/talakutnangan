import type { Request } from "!/types/dependent"
import type { DocumentProps } from "$/types/server"

import Policy from "!/bases/policy"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"


export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.knownOnlyPolicy }

	getDocumentProps(unusedRequest: Request): Promise<DocumentProps>|DocumentProps {
		return {
			"description": "App using Vite + vite-plugin-ssr",
			"title": "Profile Settings | Talaktunangan"
		}
	}
}
