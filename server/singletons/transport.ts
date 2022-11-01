/* eslint-disable no-use-before-define */
import { createTransport, Transporter, TransportOptions, SentMessageInfo } from "nodemailer"

import Log from "$!/singletons/log"
import RequestEnvironment from "$/singletons/request_environment"
import encapsulateFragment from "!/helpers/text/encapsulate_fragment"
import convertMarkdownToHTML from "!/helpers/text/convert_markdown_to_html"
import specializeTemplateFile from "!/helpers/text/specialize_template_file"

export default class Transport {
	private static currentInstance: Transport
	private static previousMessages: { [key:string]: any }[] = []

	static initialize(
		host: string,
		port: number,
		senderUsername: string,
		senderPassword: string
	): void {
		if (!this.currentInstance && (
			process.env.EMAIL_SERVER !== "false"
			|| RequestEnvironment.isOnTest
		)) {
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
			"auth": {
				pass,
				"type": "login",
				user
			},
			host,
			"jsonTransport": RequestEnvironment.isOnTest,
			port
		})

		this.transport.verify(error => {
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
		const fragment = convertMarkdownToHTML(text)
		// TODO: Check for possible CSS files in the future if necessary
		const html = await encapsulateFragment(subject, "", fragment)

		const from = this.senderUser
		const message = {
			"envelope": {
				from,
				to
			},
			from,
			html,
			subject,
			text,
			to
		}

		return await new Promise((resolve, reject) => {
			this.transport.sendMail(message, (error, info) => {
				if (error) {
					reject(error)
				} else {
					if (RequestEnvironment.isOnTest) {
						const convertedInfo = { ...info }
						convertedInfo.message = JSON.parse(convertedInfo.message)
						Transport.previousMessages.push(convertedInfo)
					}
					resolve(info)
				}
			})
		})
	}

	static consumePreviousMessages(): { [key:string]: any }[] {
		const { previousMessages } = this

		this.previousMessages = []

		return previousMessages
	}
}
