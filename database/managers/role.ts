import { Op } from "sequelize"

import type { ModelCtor, FindAndCountOptions } from "%/types/dependent"
import type { CommonConstraints, RawRole, Pipe } from "%/types/independent"

import Role from "%/models/role"
import BaseManager from "%/managers/base"
import offset from "%/managers/helpers/offset"

export default class extends BaseManager<Role, RawRole> {
	get model(): ModelCtor<Role> { return Role }

	get listPipeline(): Pipe<FindAndCountOptions<Role>, CommonConstraints>[] {
		return [
			offset
		]
	}

	async search(
		query: string,
		offset: number,
		limit: number
	): Promise<{ roles: Role[], count: number }> {
		const { rows, count } = await Role.findAndCountAll({
			where: {
				name: {
					[Op.like]: `%${query}%`
				}
			},
			offset,
			limit
		})

		return { roles: rows, count }
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
