import { Request, Response } from "express"
import { RawRoute } from "!/types"
import Controller from "!/routes/base/controller"

import UserManager from "%/managers/user_manager"
import { UserKind } from "%/types"

export default class extends Controller {
	getRawRoute(): RawRoute {
		return {
			method: "get",
			baseURL: "create"
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const manager = new UserManager()
		await manager.create({
			email: "sample@gmail.com",
			password: "12345678",
			kind: UserKind.Student
		})
		response.statusCode = this.status.CREATED
		response.end()
	}
}
