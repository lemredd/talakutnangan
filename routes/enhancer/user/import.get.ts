import type { Request } from "!/types/dependent"
import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"

import Policy from "!/bases/policy"
import Validation from "!/bases/validation"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import PermissionBasedPolicy from "!/policies/permission-based"
import { IMPORT_USERS } from "$/permissions/user_combinations"
import { user as permissionGroup } from "$/permissions/permission_list"

import Manager from "%/managers/role"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [ IMPORT_USERS ])
	}

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	getDocumentProps(): DocumentProps {
		return {
			"description": "Consultation chat platform for MCC",
			"title": "Import Users | Talakutnangan"
		}
	}

	async getPageProps(request: Request): Promise<Serializable> {
		const manager = new Manager(request)
		const pageProps = {
			"roles": await manager.list({
				"filter": {
					"department": "*",
					"existence": "exists",
					"slug": ""
				},
				"page": {
					"limit": 10,
					"offset": 0
				},
				"sort": [ "name" ]
			})
		}

		return pageProps
	}
}
