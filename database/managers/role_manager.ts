import { Op } from "sequelize"
import { RawRole } from "%/types"
import Role from "%/models/role"

export default class RoleManager {
	async list(
		query: string,
		offset: number,
		limit: number
	): Promise<{ rows: Role[], count: number }> {
		// `findAndCountAll` uses `findAll`. See https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/model.js#L2070
		// `findAll` uses `select`. See https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/model.js#L1713
		// `select` uses query generator which handles replacements. See https://github.com/sequelize/sequelize/blob/0c5ca3fc398a99eddb412fe3b2aba99f157bf59d/src/dialects/abstract/query-interface.js#L1062
		// Replacements are escaped. See https://sequelize.org/docs/v6/core-concepts/raw-queries/#bind-parameter
		return await Role.findAndCountAll({
			where: {
				name: {
					[Op.like]: `%${query}%`
				}
			},
			offset,
			limit
		})
	}

	async create(details: RawRole): Promise<Role> {
		return await Role.create({ ...details })
	}

	async update(id: number, details: RawRole): Promise<number> {
		const [ affectedCount ] = await Role.update({
			...details
		}, {
			where: { id }
		})

		return affectedCount
	}

	async archive(id: number): Promise<number> {
		const deleteCount = await Role.destroy({
			where: { id }
		})

		return deleteCount
	}

	async restore(id: number): Promise<void> {
		await Role.restore({
			where: {
				id
			}
		})
	}
}
