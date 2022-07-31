import type { Serializable } from "$/types/database"
import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type {
	CommonConstraints,
	RawRole,
	Pipe,
	RoleResourceIdentifierObject
} from "$/types/database"

import Role from "%/models/role"
import BaseManager from "%/managers/base"
import AttachedRole from "%/models/attached_role"
import RoleTransformer from "%/transformers/role"
import Condition from "%/managers/helpers/condition"
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
			where: new Condition().or(
				...roleIDs.map(roleID => new Condition().equal("id", roleID))
			).build(),
			group: [ "id", "attachedRoles.roleID" ],
			include: [
				{
					model: AttachedRole,
					as: "attachedRoles",
					required: false
				}
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
