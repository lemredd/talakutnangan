import { faker } from "@faker-js/faker"
import { Request, Response } from "express"
import { createTransport } from "nodemailer"
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
			email: process.env.EMAIL_USER,
			homePageURL: faker.internet.url(),
			emailVerificationURL: faker.internet.url()
		})
		const parsedVerification = convertMarkdownToHTML(rawVerification)

		const transport = createTransport({
			port: +process.env.EMAIL_PORT,
			host: process.env.EMAIL_HOST,
			auth: {
				type: "login",
				user: process.env.EMAIL_USER,
				pass: process.env.EMAIL_PASS
			}
		})

		transport.verify((error, success) => {
			if (error) {
				console.error("There is a problem on connecting with the e-mail server.")
				console.error(`Error [${error.name}]: ${error.message}`)
			} else {
				console.log("Connected to the e-mail server")
			}
		})

		response.status(this.status.OK)
		response.header("Content-Type", "text/html")
		response.send(parsedVerification)
		response.end()

		const from = process.env.EMAIL_USER
		const to = process.env.EMAIL_USER
		const message = {
			from,
			to,
			envelope: {
				from,
				to
			},
			subject: "Email Verification",
			text: rawVerification,
			html: parsedVerification
		}

		transport.sendMail(message, (error, info) => {
			if (error) {
				console.error(`Error [${error}]: ${error.message}`)
			} else {
				console.log(info)
			}
		})
	}
}
