import { createTransport } from "nodemailer"
import type { Transporter, TransportOptions, SentMessageInfo } from "nodemailer"

import Log from "!/helpers/log"
import RequestEnvironment from "$/helpers/request_environment"
import convertMarkdownToHTML from "!/helpers/convert_markdown_to_html"
import specializeTemplateFile from "!/helpers/specialize_template_file"

export default class Transport {
	private static currentInstance: Transport
	private static previousMessages: { [key:string]: any }[]

	static initialize(
		host: string,
		port: number,
		senderUsername: string,
		senderPassword: string
	): void {
		if (!this.currentInstance) {
			this.currentInstance = new Transport(
				host,
				port,
				senderUsername,
				senderPassword
			)
		}
	}

	static async sendMail(
		to: string[],
		subject: string,
		emailTemplatePath: string,
		variables: object
	) : Promise<SentMessageInfo> {
		return await this.currentInstance.sendMail(to, subject, emailTemplatePath, variables)
	}

	private senderUser: string
	private transport: Transporter

	constructor(host: string, port: number, user: string, pass: string) {
		this.senderUser = user
		this.transport = createTransport(<TransportOptions>{
			host,
			port,
			auth: {
				type: "login",
				user,
				pass
			},
			jsonTransport: RequestEnvironment.isOnTest
		})

		this.transport.verify((error, success) => {
			if (error) {
				Log.errorMessage("server", "There is a problem on connecting with the e-mail server.")
				Log.error("server", error)
			} else {
				Log.success("server", "Connected to the e-mail server")
			}
		})
	}

	async sendMail(to: string[], subject: string, emailTemplatePath: string, variables: object)
		: Promise<SentMessageInfo> {
		const text = await specializeTemplateFile(`email/${emailTemplatePath}`, variables)
		const html = convertMarkdownToHTML(text)

		const from = this.senderUser
		const message = {
			from,
			to,
			envelope: {
				from,
				to
			},
			subject: subject,
			text,
			html
		}

		return await new Promise((resolve, reject) => {
			this.transport.sendMail(message, (error, info) => {
				if (error) {
					reject(error)
				} else {
					if (RequestEnvironment.isOnTest) {
						Transport.previousMessages.push(info)
					}
					resolve(info)
				}
			})
		})
	}

	static consumePreviousMessages(): { [key:string]: any }[] {
		const previousMessages = this.previousMessages

		this.previousMessages = []

		return previousMessages
	}
}
