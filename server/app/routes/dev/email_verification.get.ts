import { Request, Response } from "express"
import Transport from "!/helpers/email/transport"
import { RawRoute } from "!/types"
import Controller from "!/bases/controller"
import convertMarkdownToHTML from "!/helpers/convert_markdown_to_html"
import specializeTemplateFile from "!/helpers/specialize_template_file"

export default class extends Controller {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		const emailTemplatePath = "email_verification.md"
		const variables = {
			email: process.env.EMAIL_USER,
			homePageURL: `${request.protocol}://${request.hostname}`,
			emailVerificationURL: `${request.protocol}://${request.hostname}/user/verification`
		}
		const rawVerification = await specializeTemplateFile(`email/${emailTemplatePath}`, variables)
		const parsedVerification = convertMarkdownToHTML(rawVerification)

		response.status(this.status.OK)
		response.header("Content-Type", "text/html")
		response.send(parsedVerification)
		response.end()

		const to = process.env.EMAIL_USER
		const subject = "Email Verification"

		Transport.sendMail(to, subject, emailTemplatePath, variables)
			.then(info => {
				console.log(info)
			})
			.catch(error => {
				console.error(`Error [${error}]: ${error.message}`)
			})
	}
}
