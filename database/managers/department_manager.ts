import { Op } from "sequelize"
import Department from "%/models/department"

export default class DepartmentManager {
	async findWithID(id: number): Promise<Department|null> {
		return await Department.findOne({ where: { id } })
	}
}
