import type { DocumentProps } from "$/types/server"

import Policy from "!/bases/policy"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Log In | Talakutnangan"
		}
	}

	get policy(): Policy {
		return CommonMiddlewareList.guestOnlyPolicy
	}
}
