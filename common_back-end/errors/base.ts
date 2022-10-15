import type { UnitError } from "$/types/server"

export default class extends Error {
	private code: string
	private status: number
	private redirectLink: string|null

	constructor(
		code: string,
		status: number,
		title: string,
		message: string,
		redirectLink: string|null = null
	) {
		super(message)
		this.code = code
		this.status = status
		this.name = title
		this.redirectLink = redirectLink
	}

	get redirectURL(): string|null { return this.redirectLink }

	toJSON(): UnitError {
		return {
			"code": this.code,
			"detail": this.message,
			"status": this.status,
			"title": this.name
		}
	}
}
