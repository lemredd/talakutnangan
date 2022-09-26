import type { DocumentProps } from "$/types/server"
import type { Serializable } from "$/types/general"
import type { AuthenticatedRequest } from "!/types/dependent"
import type { DeserializedUserProfile } from "$/types/documents/user"

import Policy from "!/bases/policy"
import Manager from "%/managers/role"
import Validation from "!/bases/validation"
import deserialize from "$/object/deserialize"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import ManagerClassifier from "$/helpers/manager"
import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import { READ_ANYONE_ON_OWN_DEPARTMENT } from "$/permissions/user_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [ READ_ANYONE_ON_OWN_DEPARTMENT ])
	}

	get bodyParser(): null { return null }

	get validations(): Validation[] { return [] }

	getDocumentProps(): DocumentProps {
		return {
			"description": "List of roles available that can be attached to users",
			"title": "Role list | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable> {
		const manager = new Manager(request)
		const user = deserialize(request.user) as DeserializedUserProfile<"roles"|"department">
		const classifer = new ManagerClassifier(user)
		const pageProps = {
			"roles": await manager.list({
				"filter": {
					"department": classifer.isAdmin() ? "*" : Number(user.data.department.data.id),
					"existence": "exists"
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
