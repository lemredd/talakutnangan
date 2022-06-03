import { readFile } from "fs"
import { promisify } from "util"
import { StatusCodes } from "http-status-codes"
import { Request, Response } from "express"
import { faker } from "@faker-js/faker"
import { Converter } from "showdown"
import template from "string-placeholder"
import { RawRoute } from "!/types"
import Controller from "!/routes/bases/controller"

export default class extends Controller {
	getRawRoute(): RawRoute {
		return {
			method: "get",
			baseURL: "email_verification"
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const verificationTemplatePath = `${this.root}/email/email_verification.md`
		const verificationTemplate = (await promisify(readFile)(verificationTemplatePath)).toString()
		const specializedTemplate = template(verificationTemplate, {
			email: faker.internet.exampleEmail(),
			homePageURL: faker.internet.url(),
			emailVerificationURL: faker.internet.url()
		}, {
			before: "{{ ",
			after: " }}"
		})
		const converter = new Converter()
		const convertedTemplate = converter.makeHtml(specializedTemplate)

		response.status(StatusCodes.OK)
		response.header("Content-Type", "text/html")
		response.send(convertedTemplate)
		response.end()
	}
}
