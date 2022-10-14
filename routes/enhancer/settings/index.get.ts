import type { DocumentProps } from "$/types/server"

import Policy from "!/bases/policy"
import Middleware from "!/bases/middleware"
import Validation from "!/bases/validation"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import CommonMiddlewareList from "!/middlewares/common_middleware_list"
import ForceRedirector from "!/middlewares/miscellaneous/force_redirector"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy { return CommonMiddlewareList.knownOnlyPolicy }

	get bodyParser(): null { return null }

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Settings | Talakutnangan"
		}
	}

	get validations(): Validation[] { return [] }

	get postValidationMiddlewares(): Middleware[] {
		return [
			new ForceRedirector("/settings/account")
		]
	}
}
