import { Request, Response } from "!/types/dependent"

import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import UserTransformer from "%/transformers/user"
import Serializer from "%/transformers/serializer"

import DevController from "!/common_controllers/dev_controller"

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		const department = await new DepartmentFactory().makeOne()
		const role = await new RoleFactory().makeOne()
		department.id = 0
		role.id = 0
		const list = (await new UserFactory().in(department).makeMany(25)).map(user => {
			user.department = department
			user.roles = [ role ]
			return user
		})
		const transformer = new UserTransformer()

		const serializedList = Serializer.serialize(list, transformer, {})

		response.status(this.status.OK).json(serializedList)
	}
}
