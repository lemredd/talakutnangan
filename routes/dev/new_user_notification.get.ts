import { Request, Response } from "!/types/dependent"

import DevController from "!/controllers/dev"
import encapsulateFragment from "!/helpers/text/encapsulate_fragment"
import convertMarkdownToHTML from "$/string/convert_markdown_to_html"
import specializeTemplateFile from "!/helpers/text/specialize_template_file"

export default class extends DevController {
	get filePath(): string { return __filename }

	async handle(request: Request, response: Response): Promise<void> {
		const emailTemplatePath = "new_user.md"
		const variables = {
			"email": process.env.EMAIL_USER,
			"homePageURL": `${request.protocol}://${request.hostname}`,
			"kind": "reachable employee",
			"name": "Test Account",
			"password": "12345678"
		}
		const rawEmail = await specializeTemplateFile(`email/${emailTemplatePath}`, variables)
		const parsedEmail = convertMarkdownToHTML(rawEmail)
		const containedEmail = await encapsulateFragment(
			"Sample Encapsulation using New User Notification",
			"",
			parsedEmail
		)

		response.status(this.status.OK)
		response.header("Content-Type", "text/html")
		response.send(containedEmail)
		response.end()
	}
}
