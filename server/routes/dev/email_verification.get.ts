import { readFile } from "fs"
import { promisify } from "util"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import { faker } from "@faker-js/faker"
import template from "string-placeholder"
import Controller from "!/helpers/controller"

export default class extends Controller {
	constructor() {
		super("get", "email_verification")
	}

	async handle(request: Request, response: Response): Promise<void> {
		const verificationTemplate = await promisify(readFile)(`${__dirname}/../../../email/email_verification.md`)

		response.status(StatusCodes.OK)
		response.header("Content-Type", "text/html")
		response.send(verificationTemplate)
		response.end()
	}
}
