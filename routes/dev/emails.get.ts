import { Request, Response } from "!/types/dependent"

import Transport from "!/singletons/transport"
import DevController from "!/controllers/dev"
import convertMarkdownToHTML from "$/string/convert_markdown_to_html"
import specializeTemplateFile from "!/helpers/text/specialize_template_file"
import encapsulateFragment from "!/helpers/text/encapsulate_fragment"

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		const { email } = request.query
		const emailTemplatePath = `${email}.md`
		const variables = {
			"email": process.env.EMAIL_USER,
			"emailVerificationURL": `${request.protocol}://${request.hostname}/user/verification`,
			"homePageURL": `${request.protocol}://${request.hostname}`,
			"kind": "Student",
			"name": "Sample Name",
			"password": "12345678"
		}
		const rawVerification = await specializeTemplateFile(`email/${emailTemplatePath}`, variables)
		const parsedVerification = convertMarkdownToHTML(rawVerification)
		const encapsulatedFragment = await encapsulateFragment("Sample email", "", parsedVerification)

		response.status(this.status.OK)
		response.header("Content-Type", "text/html")
		response.send(encapsulatedFragment)
		response.end()

		const to = process.env.EMAIL_USER as string
		const subject = "Sample email"

		Transport.sendMail([ to ], subject, emailTemplatePath, variables)
		.then(info => {
			console.log(info)
		})
		.catch(error => {
			console.error(`Error [${error}]: ${error.message}`)
		})
	}
}
