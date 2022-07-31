import type { Serializable } from "$/types/database"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type {
	CommonConstraints,
	RawRole,
	Pipe,
	RoleResourceIdentifierObject
} from "$/types/database"

import Role from "%/models/role"
import AttachedRole from "%/models/attached_role"
import BaseManager from "%/managers/base"
import RoleTransformer from "%/transformers/role"
import searchName from "%/managers/helpers/search_name"

export default class extends BaseManager<Role, RawRole> {
	get model(): ModelCtor<Role> { return Role }

	get transformer(): RoleTransformer { return new RoleTransformer() }

	get listPipeline(): Pipe<FindAndCountOptions<Role>, CommonConstraints>[] {
		return [
			searchName,
			...super.listPipeline
		]
	}

	async countUsers(roleIDs: number[]): Promise<Serializable> {
		const { count: counts, rows } = await Role.findAndCountAll({
			attributes: [ "id" ],
			group: "id",
			include: [
				AttachedRole
			]
		})

		const identifierObjects: RoleResourceIdentifierObject[] = []

		rows.forEach((role, i) => {
			identifierObjects.push({
				type: "role",
				id: role.id,
				meta: {
					userCount: counts[i].count
				}
			})
		})

		return { data: identifierObjects }
	}
}
