import { Request, Response } from "!/types/dependent"

import UserFactory from "~/factories/user"
import RoleFactory from "~/factories/role"
import DepartmentFactory from "~/factories/department"

import DevController from "!/controllers/dev"

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		const department = await new DepartmentFactory().makeOne()
		const role = await new RoleFactory().makeOne()
		department.id = 1
		role.id = 1
		const list = (await new UserFactory().in(department).makeMany(15)).map((user, i) => {
			user.id = i + 1
			user.department = department
			user.roles = [ role ]
			return user
		})

		const serializedList = await new UserFactory().serialize(list)

		response.status(this.status.OK).json(serializedList)
	}
}
