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
		const verificationTemplate = (await promisify(readFile)(`${__dirname}/../../../email/email_verification.md`)).toString()
		const specializedTemplate = template(verificationTemplate, {
			email: faker.internet.exampleEmail(),
			homePageURL: faker.internet.url(),
			emailVerificationURL: faker.internet.url()
		}, {
			before: "{{ ",
			after: " }}"
		})

		response.status(StatusCodes.OK)
		response.header("Content-Type", "text/html")
		response.send(specializedTemplate)
		response.end()
	}
}
