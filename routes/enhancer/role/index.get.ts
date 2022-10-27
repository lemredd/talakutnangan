import type { AuthenticatedRequest } from "!/types/dependent"
import type { DocumentProps } from "$/types/server"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import deserialize from "$/object/deserialize"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import DynamicGatedRedirector from "!/middlewares/miscellaneous/dynamic_gated_redirector"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new DynamicGatedRedirector((request: AuthenticatedRequest) => {
			const user = deserialize(request.user) as DeserializedUserProfile
			const { kind } = user.data

			if (kind === "student") return Promise.resolve({ "location": "/" })
			return Promise.resolve({ "location": "/role/list" })
		}) as unknown as Policy
	}


	get bodyParser(): null { return null }

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Users | Talakutnangan"
		}
	}

	get validations(): Validation[] { return [] }
}
