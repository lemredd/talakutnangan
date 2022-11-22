import type { Request } from "!/types/dependent"
import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"
import type { UserListDocument } from "$/types/documents/user"

import { DEFAULT_LIST_LIMIT } from "$/constants/numerical"

import Policy from "!/bases/policy"
import PageMiddleware from "!/bases/controller-likes/page_middleware"
import DynamicGatedRedirector from "!/middlewares/miscellaneous/dynamic_gated_redirector"

import Manager from "%/managers/user"

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
			if (request.isAuthenticated()) return Promise.resolve({ "location": "/" })
			return Promise.resolve(null)
		}) as unknown as Policy
	}

	async getPageProps(unusedRequest: Request): Promise<Serializable> {
		const manager = new Manager()

		const adminUsers = await manager.list({
			"filter": {
				"department": "*",
				"existence": "exists",
				"kind": "unreachable_employee",
				"role": "*",
				"slug": ""
			},
			"page": {
				"limit": DEFAULT_LIST_LIMIT,
				"offset": 0
			},
			"sort": [ "email" ]
		}) as UserListDocument

		const adminEmails = adminUsers.data
		.map(user => user.attributes.email)
		.slice(0, 3)

		return {
			adminEmails
		}
	}
}
