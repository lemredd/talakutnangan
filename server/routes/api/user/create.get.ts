import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import User from "%/models/user"
import { RawRoute } from "!/types"
import Controller from "!/helpers/controller"

export default class extends Controller {
	getRawRoute(): RawRoute {
		return {
			method: "get",
			baseURL: "create"
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		await this.manager.upsert(User, [
			{
				email: "sample@gmail.com",
				password: "12345678",
				kind: "student"
			}
		], [ "email" ])
		response.statusCode = StatusCodes.CREATED
		response.end()
	}
}
