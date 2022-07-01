import type { UnitError } from "$/types/server"

export default class extends Error {
	private code: string
	private status: number

	constructor(code: string, status: number, title: string, message: string) {
		super(message)
		this.code = code
		this.status = status
		this.name = title
	}

	toJSON(): UnitError {
		return {
			status: this.status,
			code: this.code,
			title: this.name,
			detail: this.message
		}
	}
}
