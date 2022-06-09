import { Op } from "sequelize"
import { RawDepartment } from "%/types"
import Department from "%/models/department"

export default class DepartmentManager {
	async findWithID(id: number): Promise<Department|null> {
		return await Department.findOne({ where: { id } })
	}

	async create(details: RawDepartment): Promise<Department> {
		return await Department.create({ ...details })
	}

	async update(id: number, details: Partial<RawDepartment>): Promise<number> {
		const [ affectedCount ] = await Department.update({
			...details
		}, {
			where: { id }
		})

		return affectedCount
	}

	async archive(id: number): Promise<number> {
		const deleteCount = await Department.destroy({
			where: { id }
		})

		return deleteCount
	}

	async restore(id: number): Promise<void> {
		await Department.restore({
			where: {
				id
			}
		})
	}
}
