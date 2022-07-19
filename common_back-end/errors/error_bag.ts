import type { UnitError } from "$/types/server"
import BaseError from "$!/errors/base"

export default class extends Error {
	private errors: BaseError[]

	constructor(errors: BaseError[]) {
		super()
		this.errors = errors
	}

	toJSON(): UnitError[] {
		return this.errors.map(error => error.toJSON())
	}
}
