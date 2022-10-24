import type { Serializable } from "$/types/general"
import type { DocumentProps } from "$/types/server"
import type { AuthenticatedRequest } from "!/types/dependent"

import Policy from "!/bases/policy"
import Manager from "%/managers/user"
import RoleManager from "%/managers/role"
import Validation from "!/bases/validation"
import DepartmentManager from "%/managers/department"
import present from "!/validators/manager/present"
import IDParameterValidator from "!/validations/id_parameter"
import PageMiddleware from "!/bases/controller-likes/page_middleware"

import PermissionBasedPolicy from "!/policies/permission-based"
import { user as permissionGroup } from "$/permissions/permission_list"
import {
	READ_OWN,
	READ_ANYONE_ON_OWN_DEPARTMENT,
	READ_ANYONE_ON_ALL_DEPARTMENTS
} from "$/permissions/user_combinations"

export default class extends PageMiddleware {
	get filePath(): string { return __filename }

	get policy(): Policy {
		return new PermissionBasedPolicy(permissionGroup, [
			READ_OWN,
			READ_ANYONE_ON_OWN_DEPARTMENT,
			READ_ANYONE_ON_ALL_DEPARTMENTS
		])
	}

	get validations(): Validation[] {
		return [
			new IDParameterValidator([
				[ "id", Manager, present ]
			])
		]
	}

	getDocumentProps(): DocumentProps {
		return {
			"description": "Info about the user",
			"title": "Edit User | Talakutnangan"
		}
	}

	async getPageProps(request: AuthenticatedRequest): Promise<Serializable> {
		const { id } = request.params
		const manager = new Manager(request)

		const user = await manager.findWithID(Number(id), {
			"constraints": {
				"filter": {
					"existence": "*"
				}
			}
		})

		const roles = await new RoleManager(request).list({
			"filter": {
				"department": "*",
				"existence": "exists",
				"slug": ""
			},
			"page": {
				"limit": Infinity,
				"offset": 0
			},
			"sort": [ "name" ]
		})

		const departments = await new DepartmentManager(request).list({
			"filter": {
				"existence": "exists",
				"slug": ""
			},
			"page": {
				"limit": Infinity,
				"offset": 0
			},
			"sort": [ "fullName" ]
		})


		return {
			departments,
			roles,
			user
		}
	}
}
