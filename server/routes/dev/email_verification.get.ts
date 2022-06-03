import { Request, Response } from "express"
import { faker } from "@faker-js/faker"
import { RawRoute } from "!/types"
import Controller from "!/routes/bases/controller"
import convertMarkdownToHTML from "!/helpers/convert_markdown_to_html"
import specializeTemplateFile from "!/helpers/specialize_template_file"

export default class extends Controller {
	getRawRoute(): RawRoute {
		return {
			method: "get",
			baseURL: "email_verification"
		}
	}

	async handle(request: Request, response: Response): Promise<void> {
		const rawVerification = await specializeTemplateFile("email/email_verification.md", {
			email: faker.internet.exampleEmail(),
			homePageURL: faker.internet.url(),
			emailVerificationURL: faker.internet.url()
		})
		const parsedVerification = convertMarkdownToHTML(rawVerification)

		response.status(this.status.OK)
		response.header("Content-Type", "text/html")
		response.send(parsedVerification)
		response.end()
	}
}
