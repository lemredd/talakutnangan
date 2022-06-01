import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import { faker } from "@faker-js/faker"
import Controller from "!/helpers/controller"

export default class extends Controller {
	constructor() {
		super("get", "email_verification")
	}

	async handle(request: Request, response: Response): Promise<void> {
		response.status(StatusCodes.OK)
		response.end()
	}
}
