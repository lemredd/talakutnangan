import { Request, Response } from "!/types/dependent"

import Transport from "!/helpers/email/transport"
import DevController from "!/common_controllers/dev_controller"
import convertMarkdownToHTML from "!/helpers/text/convert_markdown_to_html"
import specializeTemplateFile from "!/helpers/text/specialize_template_file"
import encapsulateFragment from "!/helpers/text/encapsulate_fragment"

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		const { email } = request.query
		const emailTemplatePath = `${email}.md`
		const variables = {
			email: process.env.EMAIL_USER,
			homePageURL: `${request.protocol}://${request.hostname}`,
			emailVerificationURL: `${request.protocol}://${request.hostname}/user/verification`
		}
		const rawVerification = await specializeTemplateFile(`email/${emailTemplatePath}`, variables)
		const parsedVerification = convertMarkdownToHTML(rawVerification)
		const encapsulatedFragment = await encapsulateFragment("Sample email", "", parsedVerification)

		response.status(this.status.OK)
		response.header("Content-Type", "text/html")
		response.send(encapsulatedFragment)
		response.end()

		const to = process.env.EMAIL_USER!
		const subject = "Email Verification"

		Transport.sendMail([ to ], subject, emailTemplatePath, variables)
			.then(info => {
				console.log(info)
			})
			.catch(error => {
				console.error(`Error [${error}]: ${error.message}`)
			})
	}
}
