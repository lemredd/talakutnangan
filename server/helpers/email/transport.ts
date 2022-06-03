import { createTransport, Transporter } from "nodemailer"

export default class Transport {
	private static currentInstance: Transport

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

	private transport: Transporter

	constructor(host: string, port: number, user: string, pass: string) {
		this.transport = createTransport({
			host,
			port,
			auth: {
				type: "login",
				user,
				pass
			}
		})

		this.transport.verify((error, success) => {
			if (error) {
				console.error("There is a problem on connecting with the e-mail server.")
				console.error(`Error [${error.name}]: ${error.message}`)
			} else {
				console.log("Connected to the e-mail server")
			}
		})
	}
}
